"use strict";

//Folded attribute
THREE.Object3D.prototype.folded = false;

//Hidden attribute (hidden objects are not serialized and dont show up in the editor)
THREE.Object3D.prototype.hidden = false;

//Initialize Object
THREE.Object3D.prototype.initialize = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update object
THREE.Object3D.prototype.update = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Dispose object
THREE.Object3D.prototype.dispose = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}

//Remove all children from object
THREE.Object3D.prototype.removeAll = function()
{
	for(var i = this.children.length - 1; i > -1; i--)
	{
		this.remove(this.children[i]);
	}
}

//Destroy object
THREE.Object3D.prototype.destroy = function()
{
	if(this.parent !== null)
	{
		if(this.dispose)
		{
			this.dispose();
		}
		this.parent.remove(this);
	}
}

//Create JSON for object
THREE.Object3D.prototype.toJSON = function(meta, resourceAccess)
{
	var isRootObject = (meta === undefined);
	var output = {};

	//If root object initialize base structure
	if(isRootObject)
	{
		meta =
		{
			fonts: {},
			videos: {},
			images: {},
			audio: {},
			geometries: {},
			materials: {},
			textures: {}
		};

		output.metadata =
		{
			version: Editor.VERSION,
			type: "NunuProgram"
		};
	}

	var object = {};

	object.uuid = this.uuid;
	object.type = this.type;
	object.name = this.name;

	object.folded = this.folded;
	object.hidden = this.hidden;

	object.castShadow = this.castShadow;
	object.receiveShadow = this.receiveShadow;
	object.visible = this.visible;

	object.matrixAutoUpdate = this.matrixAutoUpdate;
	object.matrix = this.matrix.toArray();
	
	if(JSON.stringify(this.userData) !== "{}")
	{
		object.userData = this.userData;
	}

	//If there is geometry store it
	if(this.geometry !== undefined)
	{
		if(meta.geometries[this.geometry.uuid] === undefined)
		{
			meta.geometries[this.geometry.uuid] = this.geometry.toJSON(meta);
		}

		object.geometry = this.geometry.uuid;
	}

	//If there is a material store it
	if(this.material !== undefined)
	{
		if(meta.materials[this.material.uuid] === undefined)
		{
			meta.materials[this.material.uuid] = this.material.toJSON(meta);
		}

		object.material = this.material.uuid;
	}

	//Resource access callback
	if(resourceAccess !== undefined)
	{
		resourceAccess(meta, object);
	}

	//Serialize children data
	if(this.children.length > 0)
	{
		object.children = [];

		for(var i = 0; i < this.children.length; i ++)
		{
			if(!this.children[i].hidden)
			{
				object.children.push(this.children[i].toJSON(meta).object);
			}
		}
	}

	//If root object add assets
	if(isRootObject)
	{
		output.geometries = extractFromCache(meta.geometries);
		output.materials = extractFromCache(meta.materials);
		output.textures = extractFromCache(meta.textures);
		output.images = extractFromCache(meta.images);
		output.videos = extractFromCache(meta.videos);
		output.audio = extractFromCache(meta.audio);
		output.fonts = extractFromCache(meta.fonts);	
	}

	output.object = object;
	return output;

	//Extract data from the cache hash remove metadata on each item and return as array
	function extractFromCache(cache)
	{
		var values = [];

		for(var key in cache)
		{
			var data = cache[key];
			delete data.metadata;
			values.push(data);
		}

		return values;
	}
}
