function Program(name, description, author, version, vr)
{
	THREE.Object3D.call(this);

	//Program Type
	this.type = "Program";

	//Disable auto matrix updates
	this.rotationAutoUpdate = false;
	this.matrixAutoUpdate = false;

	//Program Info
	this.name = "program";
	this.description = "";
	this.author = "";
	this.version = "0";
	this.vr = false;

	//Collect arguments
	if(name !== undefined)
	{
		this.name = name;
	}
	if(description !== undefined)
	{
		this.description = description;
	}
	if(author !== undefined)
	{
		this.author = author;
	}
	if(version !== undefined)
	{
		this.version = version;
	}
	if(vr !== undefined)
	{
		this.vr = vr;
	}

	//Initial values
	this.initial_scene = null;
	this.default_camera = null;

	//Runtime variables
	this.renderer = null;
	this.scene = null;
	this.data = function(){};
}

//Function Prototype
Program.prototype = Object.create(THREE.Object3D.prototype);
Program.prototype.icon = "editor/files/icons/script/script.png";

//Overrided functions
Program.prototype.initialize = initialize;
Program.prototype.resize = resize;
Program.prototype.remove = remove;
Program.prototype.add = add;
Program.prototype.clone = clone;
Program.prototype.toJSON = toJSON;

//Functions
Program.prototype.dispose = dispose;
Program.prototype.setScene = setScene;
Program.prototype.setInitialScene = setInitialScene;
Program.prototype.addDefaultScene = addDefaultScene;

//Set scene 
function setScene(scene)
{
	if(scene instanceof Scene)
	{
		this.scene = scene;
		this.scene.initialize();
		if(this.scene.camera === null)
		{
			this.scene.camera = this.default_camera;
		}
	}
}

//Select initial scene and initialize that scene
function initialize()
{
	if(this.initial_scene !== null)
	{
		for(var i = 0; i < this.children.length; i++)
		{
			if(this.children[i].uuid === this.initial_scene)
			{
				this.setScene(this.children[i]);
				break;
			}
		}
	}
	else
	{
		this.setScene(this.children[0]);
	}
}

//Screen resize
function resize(x, y)
{
	if(this.scene !== null)
	{
		this.scene.camera.aspect = x/y;
		this.scene.camera.updateProjectionMatrix();
	}
}

//Remove Scene
function remove(scene)
{
	var index = this.children.indexOf(scene);
	if(index > -1)
	{
		this.children.splice(index, 1);
		scene.parent = null;
	}

	//If no scene on program set actual scene to null
	if(this.children.length === 0)
	{
		this.scene = null;
	}
}

//Add scene
function add(scene)
{
	if(scene instanceof Scene)
	{
		this.children.push(scene);
		scene.parent = this;

		//If first scene set as actual scene
		if(this.children.length === 1)
		{
			this.scene = this.children[0];
		}
	}
}

//Clone program keep uuid and everything else
function clone()
{
	var data = this.toJSON();
	var loader = new ObjectLoader();
	return loader.parse(data);
}

//Set as initial scene (from uuid)
function setInitialScene(scene)
{
	this.initial_scene = scene.uuid;
}

//Create a default scene with sky
function addDefaultScene()
{
	var scene = new Scene();

	//Sky
	var sky = new Sky();
	sky.auto_update = false;
	scene.add(sky);

	var material = new THREE.MeshPhongMaterial({color:0xffffff, specular:0x333333, shininess:30});
	var geometry = new THREE.BoxBufferGeometry(1, 1, 1);

	//Box
	var model = new Model3D(geometry, material);
	model.receiveShadow = true;
	model.castShadow = true;
	model.name = "box";
	scene.add(model);

	//Floor
	model = new Model3D(geometry, material);
	model.scale.set(20, 1, 20);
 	model.position.set(0, -1, 0);
	model.receiveShadow = true;
	model.castShadow = true;
	model.name = "ground";
	scene.add(model);

	//Add scene to program
	this.add(scene);
}

//Dipose program data (to avoid memory leaks)
function dispose()
{
	//TODO <ADD CODE HERE>
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

	var object = {};
	
	object.folded = this.folded;
	object.uuid = this.uuid;
	object.type = this.type;

	object.description = this.description;
	object.author = this.author;
	object.version = this.version;
	object.vr = this.vr;
	object.name = this.name;

	if(this.initial_scene !== null)
	{
		object.initial_scene = this.initial_scene;
	}
	
	if(JSON.stringify(this.userData) !== "{}")
	{
		object.userData = this.userData;
	}

	object.castShadow = (this.castShadow === true);
	object.receiveShadow = (this.receiveShadow === true);
	object.visible = !(this.visible === false);

	object.matrix = this.matrix.toArray();

	if(this.geometry !== undefined)
	{
		if(meta.geometries[this.geometry.uuid] === undefined)
		{
			meta.geometries[this.geometry.uuid] = this.geometry.toJSON(meta);
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
			object.children.push(this.children[i].toJSON(meta).object);
		}
	}

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
			var data = cache[ key ];
			delete data.metadata;
			values.push( data );
		}

		return values;
	}
}