function Script(code, mode)
{
	THREE.Object3D.call(this);
	
	this.type = "Script";
	this.name = "script";
	
	//Disable auto matrix updates
	this.rotationAutoUpdate = false;

	//Script Code
	this.code = "//ADD CODE HERE";
	this.func = null;
	this.mode = Script.INIT;

	//Get arguments
	if(code !== undefined)
	{
		this.code = code;
	}
	if(mode !== undefined)
	{
		this.mode = mode;
	}

	//Script functions
	this.setCode(this.code);
}

//Function Prototype
Script.prototype = Object.create(THREE.Object3D.prototype);
Script.prototype.icon = "editor/files/icons/script/script.png";

//Runtime functions
Script.prototype.initialize = initialize;
Script.prototype.update = update;
Script.prototype.toJSON = toJSON;
Script.prototype.setCode = setCode;
Script.prototype.setMode = setMode;

//Script mode
Script.INIT = 0;
Script.LOOP = 1;

//Initialize
function initialize()
{
	//Run script
	if(this.mode === Script.INIT)
	{
		try
		{
			this.func();
		}
		catch(e){}
	}

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize !== undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update Script
function update()
{
	//Run script
	if(this.mode === Script.LOOP)
	{
		try
		{
			this.func();
		}
		catch(e){}
	}

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update !== undefined)
		{
			this.children[i].update();
		}
	}
}

//Set initialization code
function setCode(code)
{
	try
	{
		this.code = code;
		this.func = Function(this.code);
	}
	catch(e){}
}

//Set script mode
function setMode(mode)
{
	this.mode = mode;
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

	object.code = this.code;
	object.mode = this.mode;

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