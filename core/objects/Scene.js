"use strict";

//Scene constructor
function Scene()
{
	THREE.Scene.call(this);

	this.name = "scene";
	
	//Matrix auto update
	this.matrixAutoUpdate = false;

	//Fog
	this.fog_mode = Scene.FOG_NONE;
	this.fog_color = 0xffffff;
	this.fog_near = 4;
	this.fog_far = 10;
	this.fog_density = 0.01;

	//Clock
	this.clock = new THREE.Clock();

	//Create cannon world
	this.world = new CANNON.World();
	this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
	this.world.defaultContactMaterial.contactEquationRelaxation = 4;
	this.world.quatNormalizeSkip = 0;
	this.world.quatNormalizeFast = false;
	this.world.gravity.set(0, -9.8, 0);
	this.world.broadphase = new CANNON.NaiveBroadphase();
	this.world.solver = new CANNON.SplitSolver(new CANNON.GSSolver());
	this.world.solver.tolerance = 0.1;
	this.world.solver.iterations = 7;

	//Initialization variables
	this.initial_camera = null;

	//Runtime variables
	this.camera = null;
	this.listener = new THREE.AudioListener();
}

//Fog modes
Scene.FOG_NONE = 0;
Scene.FOG_LINEAR = 1;
Scene.FOG_EXPONENTIAL = 2;

Scene.prototype = Object.create(THREE.Scene.prototype);

//Initialize
Scene.prototype.initialize = function()
{
	//Get initial camera	
	var camera = this.getInitialCamera();
	if(camera !== null)
	{
		this.camera = camera;
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}

	this.clock.getDelta();
}

//Update scene
Scene.prototype.update = function()
{
	this.world.step(this.clock.getDelta());

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Get default camera
Scene.prototype.getInitialCamera = function(obj)
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
Scene.prototype.setFogMode = function(mode)
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
Scene.prototype.updateFog = function()
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
Scene.prototype.toJSON = function(meta)
{
	var data = THREE.Scene.prototype.toJSON.call(this, meta);

	//Fog
	data.object.fog_color = this.fog_color;
	data.object.fog_density = this.fog_density;
	data.object.fog_near = this.fog_near;
	data.object.fog_far = this.fog_far;
	data.object.fog_mode = this.fog_mode;

	//Background color
	if(this.background !== null)
	{
		data.object.background = this.background;
	}

	//Initial Camera
	if(this.initial_camera !== null)
	{
		data.object.initial_camera = this.initial_camera;
	}

	//Physics World
	data.object.world = {};
	data.object.world.gravity = this.world.gravity;

	return data;
}