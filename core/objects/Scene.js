"use strict";

//Scene constructor
function Scene()
{
	THREE.Scene.call(this);

	this.name = "scene";
	
	//Matrix auto update
	this.matrixAutoUpdate = false;

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

	var children = obj.children;
	var length = children.length;
	for(var i = 0; i < length; i++)
	{
		var camera = this.getInitialCamera(children[i]);
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
	var color = "#FFFFFF";
	if(this.fog !== null)
	{
		color = this.fog.color.getHex();
	}

	if(mode === THREE.Fog.LINEAR)
	{	
		this.fog = new THREE.Fog(color, 5, 20);
	}
	else if(mode === THREE.Fog.EXPONENTIAL)
	{
		this.fog = new THREE.FogExp2(color, 0.01);
	}
	else if(mode === THREE.Fog.NONE)
	{
		this.fog = null;
	}
}

//Create JSON for object
Scene.prototype.toJSON = function(meta)
{
	var data = THREE.Scene.prototype.toJSON.call(this, meta);

	if(this.initial_camera !== null)
	{
		data.object.initial_camera = this.initial_camera;
	}

	data.object.world = {};
	data.object.world.gravity = this.world.gravity;
	data.object.world.solver = {};
	data.object.world.solver.tolerance = this.world.solver.tolerance;
	data.object.world.solver.iterations = this.world.solver.iterations;

	return data;
}