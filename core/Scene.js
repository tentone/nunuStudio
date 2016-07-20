"use strict";

//Scene constructor
function Scene()
{
	THREE.Scene.call(this);

	this.name = "scene";

	//Disable auto matrix updates
	this.rotationAutoUpdate = false;
	this.matrixAutoUpdate = false;

	//Fog
	this.fog_color = 0xffffff;
	this.fog_near = 4;
	this.fog_far = 10;
	this.fog_density = 0.001;
	this.fog_mode = Scene.FOG_NONE;

	//Create cannon world
	this.world = new CANNON.World();
	this.world.broadphase = new CANNON.NaiveBroadphase();
	this.world.gravity.set(0, -10, 0);
	this.world.solver.tolerance = 0.001;

	//Initialization variables
	this.initial_camera = null;

	//Runtime variables
	this.data = function(){};
	this.camera = null;
	this.listener = new THREE.AudioListener();
}

//Fog modes
Scene.FOG_NONE = 0;
Scene.FOG_LINEAR = 1;
Scene.FOG_EXPONENTIAL = 2;

//Function Prototype
Scene.prototype = Object.create(THREE.Scene.prototype);

//Runtime functions
Scene.prototype.initialize = initialize;
Scene.prototype.update = update;
Scene.prototype.toJSON = toJSON;
Scene.prototype.getInitialCamera = getInitialCamera;
Scene.prototype.setFogMode = setFogMode;
Scene.prototype.updateFog = updateFog;

//Initialize
function initialize()
{
	//Get initial camera	
	var camera = this.getInitialCamera();
	if(camera !== null)
	{
		this.camera = camera;
	}

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update scene
function update()
{
	//Update physics
	this.world.step(0.016667);
	
	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Get default camera
function getInitialCamera(obj)
{
	if(obj === undefined)
	{
		obj = this;
	}

	if(this.initial_camera === obj.uuid)
	{
		return obj;
	}

	for(var i = 0; i < obj.children.length; i++)
	{
		var camera = this.getInitialCamera(obj.children[i]);
		if(camera !== null)
		{
			return camera;
		}
	}

	return null;
}

//Set fog mode
function setFogMode(mode)
{
	this.fog_mode = mode;

	if(mode === Scene.FOG_LINEAR)
	{
		this.fog = new THREE.Fog(this.fog_color, this.fog_near, this.fog_far);
	}
	else if(mode === Scene.FOG_EXPONENTIAL)
	{
		this.fog = new THREE.FogExp2(this.fog_color, this.fog_density);
	}
	else
	{
		this.fog = null;
	}
}

//Update fog from stored value
function updateFog()
{
	if(this.fog instanceof THREE.Fog)
	{
		this.fog.color.setHex(this.fog_color);
		this.fog.far = this.fog_far;
		this.fog_near = this.fog_near;
	}
	else if(this.fog instanceof THREE.FogExp2)
	{
		this.fog.color.setHex(this.fog_color);
		this.fog.density = this.fog_density;
	}
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Scene.prototype.toJSON.call(this, meta);

	data.object.fog_color = this.fog_color;
	data.object.fog_density = this.fog_density;
	data.object.fog_near = this.fog_near;
	data.object.fog_far = this.fog_far;
	data.object.fog_mode = this.fog_mode;

	if(this.background !== null)
	{
		data.object.background = {};
		data.object.background.r = this.background.r;
		data.object.background.g = this.background.g;
		data.object.background.b = this.background.b;
	}

	if(this.initial_camera !== null)
	{
		data.object.initial_camera = this.initial_camera;
	}

	return data;
}