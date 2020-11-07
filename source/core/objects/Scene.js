import {World, NaiveBroadphase, SplitSolver, GSSolver} from "cannon";
import {Color, Texture, Camera, Raycaster, Vector2, Scene as TScene, Object3D, Fog, FogExp2, Vector3, Quaternion} from "three";
import {PointOctree} from "sparse-octree";
import {Program} from "./Program.js";

/**
 * Scenes allow you to set up what and where is to be rendered by the engine.
 *
 * This is where you place objects, lights and cameras.
 *
 * A program may contain multiple scenes, its possible to change between scene using scripts.
 *
 * Scene three.js documentation available here https:// threejs.org/docs/index.html#Reference/Scenes/Scene.
 *
 * @class Scene
 * @module Core
 * @extends {Scene}
 */
function Scene()
{
	TScene.call(this);

	this.name = "scene";
	this.matrixAutoUpdate = false;

	this.usePhysics = true;

	/**
	 * Cannon.js world used for physics simulation.
	 *
	 * The world is configured by default with a NaiveBroadphase and a SplitSolver.
	 *
	 * Documentation for cannon.js physics World object can be found here http:// schteppe.github.io/cannon.js/docs/classes/World.html.
	 *
	 * @property world
	 * @type {World}
	 */
	this.world = new World();
	this.world.defaultContactMaterial.contactEquationStiffness = 1e9;
	this.world.defaultContactMaterial.contactEquationRelaxation = 4;
	this.world.quatNormalizeSkip = 0;
	this.world.quatNormalizeFast = false;
	this.world.gravity.set(0, -9.8, 0);
	this.world.broadphase = new NaiveBroadphase();
	this.world.solver = new SplitSolver(new GSSolver());
	this.world.solver.tolerance = 0.05;
	this.world.solver.iterations = 7;

	/**
	 * Background of the scene.
	 *
	 * The background of the scene is drawn after the renderer clears the buffers.
	 *
	 * It can be a color, a texture or a cubemap.
	 *
	 * @property background
	 * @type {Color|Texture}
	 */
	this.background = new Color(0x000000);

	/**
	 * Opacity of the background color.
	 *
	 * @property alpha
	 * @type {number}
	 */
	this.alpha = 1.0;

	/**
	 * List of active cameras currently being displayed.
	 *
	 * The cameras are rendered by their render order.
	 *
	 * @property cameras
	 * @type {Array}
	 */
	this.cameras = [];

	/**
	 * Default camera of the scene used where there is no active camera.
	 *
	 * While using the editor the scene default camera gets set as the last camera configuration used.
	 *
	 * @property defaultCamera
	 * @type {Camera}
	 */
	this.defaultCamera = null;

	/**
	 * Stores the time since the last frame.
	 *
	 * @property delta
	 * @type {number}
	 */
	this.delta = 0;

	/**
	 * Raycaster used for mouse interaction with 3D objects.
	 *
	 * This raycaster is automatically updated using the first camera being drawn.
	 *
	 * @property raycaster
	 * @type {Raycaster}
	 */
	this.raycaster = new Raycaster();

	/**
	 * Indicates if the scene is using octree indexation for raycasting.
	 *
	 * @property useOctree
	 * @type {boolean}
	 */
 	this.useOctree = false;

	// TODO <ADD OCTREE CODE>

	/**
	 * Octree used to index all the unoObject in the scene being visualized.
	 *
	 * It is used to filter the visibility of objects and raycast them.
	 *
	 * @attribute octree
	 * @type {PointOctree}
	 */
	this.octree = null;

	/**
	 * Flag indicating if the is a octree update scheduled.
	 *
	 * Avoids scheduling multiple octree updates from different objects.
	 *
	 * @attribute octreeUpdateScheduled
	 * @type {Boolean}
	 */
	this.octreeUpdateScheduled = false;

	/**
	 * Stores the octree object matches, that are the objects currently visible.
	 *
	 * @attribute octreeMatches
	 * @type {Array}
	 */
	this.octreeMatches = [];

	/**
	 * Program that contains this scene.
	 *
	 * @property program
	 * @type {Program}
	 */
	this.program = null;

	/**
	 * Canvas used to draw this scene.
	 *
	 * @property canvas
	 * @type {Element}
	 */
	this.canvas = null;

	/**
	 * Normalized mouse coordinates used by the scene internal raycaster.
	 *
	 * @property mouse
	 * @type {Vector2}
	 */
	this.mouse = new Vector2(0, 0);
}

Scene.prototype = Object.create(TScene.prototype);

Scene.prototype.initialize = function()
{
	this.program = this.parent;
	this.canvas = this.parent.canvas;

	Object3D.prototype.initialize.call(this);

	for (var i = 0; i < this.children.length; i++)
	{
		this.children[i].traverse(function(children)
		{
			children.initialize();
		});
	}
};

/**
 * Update scene objects and the physics world.
 *
 * Also updates the global ray caster object used for object culling.
 *
 * @method update
 * @param {number} delta The time since the last frame.
 */
Scene.prototype.update = function(delta)
{
	this.mouse.set(this.program.mouse.position.x / this.canvas.width * 2 - 1, -2 * this.program.mouse.position.y / this.canvas.height + 1);

	if (this.cameras.length > 0)
	{
		this.raycaster.setFromCamera(this.mouse, this.cameras[0]);
	}
	else if (this.defaultCamera !== null)
	{
		this.raycaster.setFromCamera(this.mouse, this.defaultCamera);
	}

	if (this.usePhysics)
	{
		this.world.step(delta < 0.05 ? delta : 0.05);
	}

	for (var i = 0; i < this.children.length; i++)
	{
		this.children[i].traverse(function(children)
		{
			children.update(delta);
		});
	}
};

Scene.prototype.resize = function(x, y)
{
	if (this.defaultCamera !== null)
	{
		this.defaultCamera.resize(x, y);
	}

	for (var i = 0; i < this.cameras.length; i++)
	{
		this.cameras[i].resize(x, y);
	}

	for (var i = 0; i < this.children.length; i++)
	{
		this.children[i].traverse(function(children)
		{
			children.resize(x, y);
		});
	}
};

Scene.prototype.dispose = function()
{
	for (var i = 0; i < this.children.length; i++)
	{
		this.children[i].traverse(function(children)
		{
			children.dispose();
		});
	}
};

/**
 * Render scene using all active cameras.
 *
 * @method render
 * @param {Renderer} renderer
 */
Scene.prototype.render = function(renderer)
{
	renderer.setClearColor(this.background, this.alpha);

	if (this.cameras.length > 0)
	{
		if (this.program.xrEnabled)
		{

			// TODO <TEST FOR AR>
			renderer.render(this, this.cameras[0]);

			/*
			for (var i = 0; i < this.cameras.length; i++)
			{
				this.cameras[i].render(renderer, this);
			}
			*/
		}
		else
		{
			renderer.setScissorTest(true);

			for (var i = 0; i < this.cameras.length; i++)
			{
				this.cameras[i].setupRenderer(renderer);
				this.cameras[i].render(renderer, this);
			}

			renderer.setScissorTest(false);
		}

	}

	else if (this.defaultCamera !== null)
	{
		this.defaultCamera.render(renderer, this);
	}
};

/**
 * Get camera from scene using cameras uuid.
 *
 * @method getCamera
 * @param {string} uuid UUID of the camera
 * @return {Camera} Camera if found, else null
 */
Scene.prototype.getCamera = function(uuid, object)
{
	if (object === undefined)
	{
		object = this;
	}

	if (uuid === object.uuid)
	{
		return object;
	}

	var children = object.children;
	for (var i = 0; i < children.length; i++)
	{
		var camera = this.getCamera(uuid, children[i]);
		if (camera !== null)
		{
			return camera;
		}
	}

	return null;
};

/**
 * Add camera to active cameras list.
 *
 * @method addCamera
 * @param {Camera} camera
 */
Scene.prototype.addCamera = function(camera)
{
	if (this.cameras.indexOf(camera) === -1)
	{
		this.cameras.push(camera);
		this.updateCameraOrder();
	}
};

/**
 * Update active camera lister order.
 *
 * This method should be called after changing order value for an active camera.
 *
 *
 * @method updateCameraOrder
 */
Scene.prototype.updateCameraOrder = function()
{
	this.cameras.sort(function(a, b)
	{
		return a.order > b.order;
	});
};

/**
 * Remove camera from active camera list.
 *
 * @param {Camera} camera Camera to be removed
 * @method removeCamera
 */
Scene.prototype.removeCamera = function(camera)
{
	var index = this.cameras.indexOf(camera);
	if (index > -1)
	{
		this.cameras.splice(index, 1);
	}
};

/**
 * Check is camera is active.
 *
 * @param {Camera} camera Camera to be removed
 * @method isCameraActive
 */
Scene.prototype.isCameraActive = function(camera)
{
	return this.cameras.indexOf(camera) > -1;
};


/**
 * Set scene fog mode.
 *
 * It recreates the fog object attached to the scene and set the same color.
 *
 * @method setFogMode
 * @param {number} mode
 */
Scene.prototype.setFogMode = function(mode)
{
	var color = this.fog !== null ? this.fog.color.getHex() : "#FFFFFF";

	if (mode === Fog.LINEAR)
	{
		this.fog = new Fog(color, 5, 20);
	}
	else if (mode === Fog.EXPONENTIAL)
	{
		this.fog = new FogExp2(color, 0.01);
	}
	else if (mode === Fog.NONE)
	{
		this.fog = null;
	}
};

Scene.prototype.toJSON = function(meta)
{
	if (!this.parent || this.parent.type !== "Program")
	{
		console.warn("nunuStudio: Scene is not on top level serializing as Group.");

		this.type = "Group";
		return Object3D.prototype.toJSON.call(this, meta);
	}

	var self = this;

	var data = Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		// Background
		if (self.background instanceof Color)
		{
			object.background = self.background.toJSON(meta);
		}
		else if (self.background instanceof Texture)
		{
			object.background = self.background.toJSON(meta).uuid;
		}

		// Environment
		if (self.environment instanceof Texture)
		{
			object.environment = self.environment.toJSON(meta).uuid;
		}
	});

	if (this.defaultCamera !== null)
	{
		var position = new Vector3();
		var quaternion = new Quaternion();
		var scale = new Vector3();

		this.defaultCamera.matrixWorld.decompose(position, quaternion, scale);

		var defaultCamera = this.defaultCamera.toJSON(meta);
		defaultCamera.object.position = position.toArray();
		defaultCamera.object.quaternion = quaternion.toArray();
		defaultCamera.object.scale = scale.toArray();
		data.object.defaultCamera = defaultCamera;
	}

	if (this.fog !== null)
	{
		data.object.fog = this.fog.toJSON();
	}

	data.object.usePhysics = this.usePhysics;

	data.object.cameras = [];
	for (var i = 0; i < this.cameras.length; i++)
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
};

export {Scene};
