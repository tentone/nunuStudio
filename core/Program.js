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
	this.vr_scale = 1;

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

	//Assets
	this.materials = [];
	this.textures = [];

	//Initial values
	this.initial_scene = null;
	this.default_camera = null;

	//Runtime variables
	this.renderer = null;
	this.scene = null;
	this.data = function(){};
}

//Program methods
Program.prototype = Object.create(THREE.Object3D.prototype);
Program.prototype.initialize = initialize;
Program.prototype.resize = resize;
Program.prototype.remove = remove;
Program.prototype.add = add;
Program.prototype.clone = clone;
Program.prototype.toJSON = toJSON;
Program.prototype.dispose = dispose;

//Asset management
Program.prototype.addMaterial = addMaterial;
Program.prototype.removeMaterial = removeMaterial;
Program.prototype.addTexture = addTexture;
Program.prototype.removeTexture = removeTexture;

//Scene manipulation
Program.prototype.setScene = setScene;
Program.prototype.setInitialScene = setInitialScene;
Program.prototype.addDefaultScene = addDefaultScene;

//Add material to materials list
function addMaterial(material)
{
 	//TODO <ADD CODE HERE>
}

//Remove material from materials list (also receives default used to replace)
function removeMaterial(material, default_material)
{
	//TODO <ADD CODE HERE>
}

//Add texture to texture list
function addTexture(texture)
{
	//TODO <ADD CODE HERE>
}

//Remove texture from textures list
function removeTexture(texture, default_texture)
{
	//TODO <ADD CODE HERE>
}

//Set actual scene (to be used in runtime)
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

//Add children to program (only allows Scenes to be added)
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

//Clone program (keep uuid and everything else)
function clone()
{
	return new ObjectLoader().parse(this.toJSON());
}

//Set as initial scene (from uuid reference)
function setInitialScene(scene)
{
	this.initial_scene = scene.uuid;
}

//Create a default scene with sky
function addDefaultScene(material)
{
	if(material === undefined)
	{
		material = new THREE.MeshPhongMaterial({color:0xffffff, specular:0x333333, shininess:30});
		material.name = "default";
	}

	//Create new scene
	var scene = new Scene();

	//Sky
	var sky = new Sky();
	sky.auto_update = false;
	scene.add(sky);

	//Box
	var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
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

//Dispose program data (to avoid memory leaks)
function dispose()
{
	//Dispose materials
	for(var i = 0; i < this.materials.length; i++)
	{
		this.materials[i].dispose();
	}

	//Dispose textures
	for(var i = 0; i < this.textures.length; i++)
	{
		this.textures[i].dispose();
	}
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.author = this.author;
	data.object.description = this.description;
	data.object.version = this.version;
	data.object.vr = this.vr;
	data.object.vr_scale = this.vr_scale;

	if(this.initial_scene !== null)
	{
		data.object.initial_scene = this.initial_scene;
	}

	return data;
}