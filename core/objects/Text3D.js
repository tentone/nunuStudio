function Text3D(text, font , material)
{
	THREE.Mesh.call(this, new THREE.TextGeometry(text, {font: font}), material);
	
	this.name = "text";
	this.type = "Text3D";
	
	this.font = font;
	this.text = text;

	this.scale.set(0.01, 0.01, 0.01);
}

//Function Prototype
Text3D.prototype = Object.create(THREE.Mesh.prototype);
Text3D.prototype.icon = "editor/files/icons/models/text.png";

//Runtime functions
Text3D.prototype.initialize = initialize;
Text3D.prototype.update = update;

//Auxiliar Functions
Text3D.prototype.setText = setText;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize !== undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update State
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update !== undefined)
		{
			this.children[i].update();
		}
	}
}

//Set Text
function setText(text)
{
	this.text = text;
	this.geometry = new THREE.TextGeometry(this.text, {font: this.font});
}

//Create JSON for object
function toJSON(meta)
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
			version: 4.4,
			type: 'Object',
			generator: 'Object3D.toJSON'
		};
	}

	//Script serialization
	var object = {};
	object.uuid = this.uuid;
	object.type = this.type;

	object.text = this.text;

	if(this.name !== '')
	{
		object.name = this.name;
	}
	if(JSON.stringify(this.userData) !== '{}')
	{
		object.userData = this.userData;
	}

	object.castShadow = (this.castShadow === true);
	object.receiveShadow = (this.receiveShadow === true);
	object.visible = !(this.visible === false);

	object.matrix = this.matrix.toArray();

	if(this.geometry !== undefined)
	{
		if(meta.geometries[ this.geometry.uuid ] === undefined)
		{
			meta.geometries[ this.geometry.uuid ] = this.geometry.toJSON( meta );
		}

		object.geometry = this.geometry.uuid;
	}

	if(this.material !== undefined)
	{
		if(meta.materials[this.material.uuid] === undefined)
		{
			meta.materials[this.material.uuid] = this.material.toJSON(meta);
		}

		object.material = this.material.uuid;
	}

	//Collect children data
	if(this.children.length > 0)
	{
		object.children = [];

		for(var i = 0; i < this.children.length; i ++)
		{
			object.children.push( this.children[ i ].toJSON(meta).object);
		}
	}

	if(isRootObject)
	{
		var geometries = extractFromCache( meta.geometries );
		var materials = extractFromCache( meta.materials );
		var textures = extractFromCache( meta.textures );
		var images = extractFromCache( meta.images );

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
			var data = cache[ key ];
			delete data.metadata;
			values.push( data );
		}

		return values;
	}
}