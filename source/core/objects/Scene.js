"use strict";

/**
 * Scenes allow you to set up what and where is to be rendered by three.js. This is where you place objects, lights and cameras.
 * Scene original documentation available here https://threejs.org/docs/index.html#Reference/Scenes/Scene
 * @class Scene
 * @module Core
 * @constructor
 * @extends {Scene}
 */

/**
 * Cannon.js world used for physics simulation
 * @property {World} world
 */
/**
 * Raycaster used for mouse interaction with 3D objects
 * @property {Raycaster} raycaster
 */
/**
 * Normalized mouse coordinates used by the raycaster
 * @property {Vector2} mouse
 */
/**
 * Program that contains this scene
 * @property {Program} program
 */
/**
 * Canvas used to draw this scene
 * @property {DOM} canvas
 */
function Scene()
{
	THREE.Scene.call(this);

	this.name = "scene";
	this.matrixAutoUpdate = false;

	//Physics world
	this.world = new CANNON.World();
	this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
	this.world.defaultContactMaterial.contactEquationRelaxation = 4;
	this.world.quatNormalizeSkip = 0;
	this.world.quatNormalizeFast = false;
	this.world.gravity.set(0, -9.8, 0);
	this.world.broadphase = new CANNON.NaiveBroadphase();
	this.world.solver = new CANNON.SplitSolver(new CANNON.GSSolver());
	this.world.solver.tolerance = 0.05;
	this.world.solver.iterations = 7;

	//Cameras in use
	this.cameras = [];

	//Runtime objects
	this.clock = new THREE.Clock();
	this.raycaster = new THREE.Raycaster();

	//Renderer canvas
	this.program = null;
	this.canvas = null;

	//Mouse normalized
	this.mouse = new THREE.Vector2(0, 0);
}

Scene.prototype = Object.create(THREE.Scene.prototype);

/**
 * Initialize scene objects
 * Called automatically by the runtime
 * @method initialize
 */
Scene.prototype.initialize = function()
{
	//Canvas and program
	this.program = this.parent;
	this.canvas = this.parent.canvas;

	//Start clock
	this.clock.start();

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

/**
 * Update scene
 * Called automatically by the runtime
 * @method update
 */
Scene.prototype.update = function()
{
	this.mouse.set(this.program.mouse.position.x/this.canvas.width * 2 - 1, -2 * this.program.mouse.position.y/this.canvas.height + 1);

	if(this.cameras.length > 0)
	{
		this.raycaster.setFromCamera(this.mouse, this.cameras[0]);
	}

	var delta = this.clock.getDelta();
	this.world.step((delta < 0.05) ? delta : 0.05);

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

/**
 * Get camera from scene using cameras uuid
 * @method getCamera
 * @param {String} uuid UUID of the camera
 * @return {Camera} Camera if found, else null
 */
Scene.prototype.getCamera = function(uuid, obj)
{
	if(obj === undefined)
	{
		obj = this;
	}

	if(uuid === obj.uuid)
	{
		return obj;
	}

	var children = obj.children;
	for(var i = 0; i < children.length; i++)
	{
		var camera = this.getCamera(uuid, children[i]);
		if(camera !== null)
		{
			return camera;
		}
	}

	return null;
}

/**
 * Add camera to active cameras list
 * @method addCamera
 * @param {Camera} camera
 */
Scene.prototype.addCamera = function(camera)
{
	this.cameras.push(camera);
	this.updateCameraOrder();
}

/**
 * Update active cameras order
 * @method updateCameraOrder
 */
Scene.prototype.updateCameraOrder = function()
{
	this.cameras.sort(function(a,b)
	{
		return a.order < b.order;
	});
}

/**
 * Remove camera from active camera list
 * @param {Camera} camera Camera to be removed
 * @method removeCamera
 */
Scene.prototype.removeCamera = function(camera)
{
	var index = this.cameras.indexOf(camera);
	if(index > -1)
	{
		this.cameras.splice(index, 1);
	}
}

/**
 * Set scene fog mode
 * @param {Number} mode
 * @method setFogMode
 */
Scene.prototype.setFogMode = function(mode)
{	
	var color = (this.fog !== null) ? this.fog.color.getHex() : "#FFFFFF";

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

/**
 * Serialize object as JSON
 * Also serializes physics world information
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
Scene.prototype.toJSON = function(meta)
{
	var data = THREE.Scene.prototype.toJSON.call(this, meta);

	data.object.cameras = [];
	for(var i = 0; i < this.cameras.length; i++)
	{
		data.object.cameras.push(this.cameras[i].uuid);
	}

	data.object.world = {};
	data.object.world.gravity = this.world.gravity;
	data.object.world.quatNormalizeSkip = this.world.quatNormalizeSkip;
	data.object.world.quatNormalizeFast = this.world.quatNormalizeFast;
	data.object.world.solver = {};
	data.object.world.solver.tolerance = this.world.solver.tolerance;
	data.object.world.solver.iterations = this.world.solver.iterations;

	return data;
}