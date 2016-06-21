//Object3D changes
THREE.Object3D.prototype.folded = false;
THREE.Object3D.prototype.hidden = false;

//Initialize Object
THREE.Object3D.prototype.initialize = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
};

//Update object
THREE.Object3D.prototype.update = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
};

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
			geometries: {},
			materials: {},
			textures: {},
			images: {}
		};

		output.metadata =
		{
			version: 1.0,
			type: "NunuProgram"
		};
	}

	var object = {};

	object.uuid = this.uuid;
	object.type = this.type;
	object.name = this.name;
	object.folded = this.folded;
	object.hidden = this.hidden;
	
	if(JSON.stringify(this.userData) !== "{}")
	{
		object.userData = this.userData;
	}

	object.castShadow = (this.castShadow === true);
	object.receiveShadow = (this.receiveShadow === true);
	object.visible = !(this.visible === false);

	object.matrixAutoUpdate = (this.matrixAutoUpdate === true);
	object.matrix = this.matrix.toArray();

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

	//Collect children data
	if(this.children.length > 0)
	{
		object.children = [];

		for(var i = 0; i < this.children.length; i ++)
		{
			object.children.push(this.children[i].toJSON(meta).object);
		}
	}

	//If root object add resources before returning
	if(isRootObject)
	{
		var geometries = extractFromCache(meta.geometries);
		var materials = extractFromCache(meta.materials);
		var textures = extractFromCache(meta.textures);
		var images = extractFromCache(meta.images);

		if(geometries.length > 0)
		{
			output.geometries = geometries;
		}
		if(materials.length > 0)
		{
			output.materials = materials;
		}
		if(textures.length > 0)
		{
			output.textures = textures;
		}
		if(images.length > 0)
		{
			output.images = images;
		}
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
