"use strict";

/**
 * Program class contains all the data of a nunuStudio program.
 * 
 * Is stores and manages all available resources used by the children objects.
 *
 * Is responsible for handling runtime tasks, initialization, update, resizes etc.
 * 
 * @class Program
 * @module Core
 * @param {string} name Program name
 * @extends {ResourceManager}
 */
function Program(name)
{
	ResourceManager.call(this);

	this.type = "Program";

	this.matrixAutoUpdate = false;

	/**
	 * NunuRuntime instance used to communication between nunu app and the host webpage.
	 *
	 * Inside the editor communication with the app is simulated on the debug console.
	 *
	 * @property app
	 * @type {NunuApp}
	 */
	this.app = null;

	/**
	 * Program name.
	 *
	 * @property name
	 * @type {string}
	 */
	this.name = (name !== undefined) ? name : "program";

	/**
	 * Program description, will be stamped when the app is exported.
	 *
	 * @property description
	 * @type {string}
	 */
	this.description = "";

	/**
	 * Program author, will be stamped when the app is exported.
	 *
	 * @property author
	 * @type {string}
	 */
	this.author = "";

	/**
	 * Program version should adhere to semantic versioning, but it is not mandatory.
	 *
	 * @property version
	 * @type {string}
	 * @default "0.0.0"
	 */
	this.version = "0.0.0";

	/**
	 * Flag to control pointer locking, when set true the cursor is locked into the application window.
	 *
	 * @property lockPointer
	 * @type {boolean}
	 * @default false
	 */
	this.lockPointer = false;

	/**
	 * Flag to indicate if the runtime should handle device pixel ratio.
	 *
	 * If set false the runtime will ignore the pixel ratio, and use in browser coordinates.
	 *
	 * @property handlePixelRatio
	 * @type {boolean}
	 * @default false
	 */
	this.handlePixelRatio = false;

	/**
	 * Enable virtual reality flag, allows the application to run in VR mode.
	 *
	 * VR mode can only be enabled if the system and browser have support for VR.
	 *
	 * @property vr
	 * @default false
	 * @type {boolean}
	 */
	this.vr = false;

	/**
	 * Virtual reality movement scale.
	 * 
	 * Indicates the relation between the real movement and virtual world movement.
	 *
	 * @property vrScale
	 * @type {number}
	 * @default 1.0
	 */
	this.vrScale = 1.0;

	/** 
	 * Renderer configuration applied to the WebGL renderer.
	 *
	 * @property rendererConfig
	 * @type {RendererConfiguration}
	 */
	this.rendererConfig = new RendererConfiguration();

	/**
	 * Target related configurations applied when exporting the app.
	 *
	 * @property targetConfig
	 * @type {TargetConfig}
	 */
	this.targetConfig = new TargetConfig();

	/**
	 * Scene loaded as default on startup.
	 *
	 * @property defaultScene
	 * @type {THREE.Scene}
	 */
	this.defaultScene = null;

	/**
	 * Default camera to be used by scenes where there is no camera.
	 *
	 * On the editor this value is automatically set to the last editor camera point used
	 *
	 * @property defaultCamera
	 * @type {THREE.Camera}
	 */
	this.defaultCamera = null;

	/**
	 * Scene currently running in the program, runtime variable.
	 *
	 * Should never be manually defined, change it using the setScene(scene) method.
	 *
	 * @property scene
	 * @type {Scene}
	 */
	this.scene = null;

	/**
	 * Keyboard input object, runtime variable.
	 *
	 * @property keyboard
	 * @type {Keyboard}
	 */
	this.keyboard = null;

	/**
	 * Mouse input object, runtime variable.
	 *
	 * @property mouse
	 * @type {Mouse}
	 */
	this.mouse = null;

	/**
	 * Renderer being used during runtime.
	 *
	 * @property renderer
	 * @type {WebGLRenderer}
	 */
	this.renderer = null;

	/**
	 * Canvas being used to draw content by the renderer.
	 *
	 * This canvas is where the WebGL rendering context was created.
	 *
	 * @property canvas
	 * @type {Element}
	 */
	this.canvas = null;

	/**
	 * DOM Division element that can be used to add html content to the app.
	 *
	 * All content added to this division should be manually removed before the app exits.
	 *
	 * @property division
	 * @type {Element}
	 */
	this.division = null;

	/**
	 * Event manager used to attach and manage program events.
	 *
	 * @property manager
	 * @type {EventManager}
	 */
	this.manager = new EventManager();

	/**
	 * Clock object used to measure times between frames.
	 *
	 * The time measured is passed down to the scene and its children elements.
	 *
	 * @property clock
	 * @type {THREE.Clock}
	 */
	this.clock = new THREE.Clock();

	/**
	 * VR runtime control, true when the app is running in VR mode.
	 *
	 * @property vrRunning
	 * @type {boolean}
	 */
	this.vrRunning = false;
}

Program.prototype = Object.create(ResourceManager.prototype);

/**
 * Select initial scene and initialize that scene.
 * 
 * Automatically called by the runtime.
 * 
 * @method initialize
 */
Program.prototype.initialize = function()
{
	this.manager.create();

	// If input null create input object
	if(this.mouse === null)
	{
		this.mouse = new Mouse();
	}

	if(this.keyboard === null)
	{
		this.keyboard = new keyboard();
	}

	// Get default scene
	if(this.defaultScene !== null)
	{
		for(var i = 0; i < this.children.length; i++)
		{
			if(this.children[i].uuid === this.defaultScene)
			{
				this.setScene(this.children[i]);
				break;
			}
		}
	}
	else if(this.children.length > 0)
	{
		this.setScene(this.children[0]);
	}
	
	this.clock.start();
};

/**
 * Set program mouse and keyboard.
 *
 * Should be set before initialize() is called otherwise a keyboard and mouse are created by default.
 * 
 * @method setMouseKeyboard
 * @param {Mouse} mouse
 * @param {Keyboard} keyboard
 */
Program.prototype.setMouseKeyboard = function(mouse, keyboard)
{
	if(this.mouse !== mouse)
	{
		if(this.mouse !== null)
		{
			this.mouse.dispose();
		}

		this.mouse = mouse;
	}

	if(this.keyboard !== keyboard)
	{
		if(this.keyboard !== null)
		{
			this.keyboard.dispose();
		}
		this.keyboard = keyboard;	
	}
};

/**
 * Set program renderer to be used by this program.
 *
 * @method setRenderer
 * @param {WebGLRenderer} renderer Three.js renderer to be used by this program
 * @param {bool} configure If true also updates renderer configuration to match rendering quality specified in the program.
 */
Program.prototype.setRenderer = function(renderer, configure)
{
	this.renderer = renderer;
	this.renderer.autoClear = false;

	this.canvas = renderer.domElement;
	this.division = this.canvas.parentElement;

	if(configure)
	{
		this.updateRenderer();
	}
};

/**
 * Update program state, this updated all current scene children elements.
 * 
 * @method update
 */
Program.prototype.update = function()
{
	var delta = this.clock.getDelta();

	this.scene.update(delta);
};

/**
 * Render current scene to canvas.
 *
 * When rendering in VR mode all effects and camera parameters are ignored.
 * 
 * Renderer should be initialized and passed as argument.
 * 
 * @method render
 * @param {Renderer} renderer
 */
Program.prototype.render = function(renderer)
{
	this.scene.render(renderer);
};

/**
 * Resize the current scene elements.
 * 
 * @method resize
 * @param {number} x Width.
 * @param {number} y Height.
 */
Program.prototype.resize = function(x, y)
{
	// Resize the default camera
	if(this.defaultCamera !== null)
	{
		this.defaultCamera.resize(x, y);
	}

	this.scene.resize(x, y);
};

/**
 * This method updated the webgl renderer configuration.
 *
 * Should be called after changing any rendering related parameter.
 *
 * @method updateRenderer
 */
Program.prototype.updateRenderer = function()
{
	if(this.renderer !== null)
	{
		this.rendererConfig.apply(this.renderer);
	}
};


/**
 * Check if virtual reality is available. 
 * 
 * @method vrAvailable
 */
Program.prototype.vrAvailable = function()
{
	return this.vr && Nunu.vrAvailable();
};

/**
 * Enter virtual reality mode.
 * 
 * @method enterVR
 */
Program.prototype.enterVR = function()
{
	if(this.vr)
	{
		var self = this;
		Nunu.enterVR(this.renderer, function()
		{
			self.vrRunning = true;
		});
	}
};

/**
 * Exit virtual relity mode.
 * 
 * @method exitVR
 */
Program.prototype.exitVR = function()
{
	if(this.vr)
	{
		Nunu.exitVR(this.renderer);
		this.vrRunning = false;
	}
};

/**
 * Change scene during runtime, this method can receive booth a scene name or a scene object.
 * 
 * This method should be used inside of script objects during runtime.
 * 
 * @method setScene
 * @param {Scene|String} scene Scene object or name of the scene to be used.
 */
Program.prototype.setScene = function(scene)
{
	// Try to get scene by UUID
	if(typeof scene === "string")
	{
		scene = this.getObjectByName(scene);
	}

	// Dispose old scene to free up resources
	if(this.scene !== null)
	{
		this.scene.dispose();
	}

	// Set new scene and inialize its resources
	this.scene = scene;

	if(this.scene !== null)
	{
		if(this.scene.defaultCamera === null)
		{
			this.scene.defaultCamera = this.defaultCamera;
		}

		this.scene.initialize();
	}
	else
	{
		console.warn("nunuStudio: Program setScene scene is null.");
	}
};

/**
 * Remove Scene from program.
 * 
 * @method remove
 * @param {Scene} scene
 */
Program.prototype.remove = function(scene)
{
	if(scene instanceof Scene)
	{
		// Remove scene from the children list
		var index = this.children.indexOf(scene);
		if(index > -1)
		{
			this.children.splice(index, 1);
			scene.parent = null;
		}

		// If the scene remove was in use, dispose it
		if(scene === this.scene)
		{
			this.scene.dispose();
			this.scene = null;
		}
		
		// If there are no scenes on program set actual scene to null
		if(this.children.length === 0)
		{
			this.scene = null;
		}
	}
	else
	{
		console.warn("nunuStudio: Trying to remove Object3D from program, only Scene objects allowed.");
	}
};

/**
 * Add new scene to this program.
 * 
 * On the program class only scenes can be added as children.
 * 
 * @method add
 * @param {Scene} scene
 */
Program.prototype.add = function(scene)
{
	if(scene instanceof Scene)
	{
		scene.parent = this;
		this.children.push(scene);
	}
	else
	{
		console.warn("nunuStudio: Trying to add Object3D to program, only Scene objects allowed.");
	}
};

/**
 * Clone program, keeping uuids and every identification attribute.
 * 
 * Clone method uses the ObjectLoad to serialize and create a new program instance with the same data.
 * 
 * @method clone
 * @return {Program} Cloned program
 */
Program.prototype.clone = function()
{
	return new ObjectLoader().parse(this.toJSON());
};

/**
 * Set a scene as initial scene using its uuid.
 * 
 * This method is used by the editor.
 * 
 * @method setInitialScene
 * @param {string} uuid Scene uuid
 */
Program.prototype.setInitialScene = function(scene)
{
	this.defaultScene = scene.uuid;
};

/**
 * Dispose program data to avoid memory leaks.
 * 
 * Called when exiting the program.
 * 
 * @method dispose
 */
Program.prototype.dispose = function()
{
	this.manager.destroy();

	if(this.scene !== null)
	{
		this.scene.dispose();
	}
	else
	{
		console.warn("nunuStudio: Program dispose() scene is null.", this);
	}
	
	ResourceManager.prototype.dispose.call(this);
	THREE.Object3D.prototype.dispose.call(this);
};

/**
 * Receive external data and pass it to all script instances.
 * 
 * @param {Object} data
 * @method receiveDataApp
 */
Program.prototype.receiveDataApp = function(data)
{
	var found = false;

	// Check if there is a script with onAppData method available
	this.traverse(function(child)
	{
		if(child instanceof Script)
		{
			child.appData(data);
			found = true;
		}
	});

	// Show warning message
	if(!found)
	{
		console.warn("nunuStudio: No script with onAppData found", data);
	}
};

/**
 * Send data to external app instance.
 * 
 * @param {Object} data
 * @method sendDataApp
 */
Program.prototype.sendDataApp = function(data)
{
	if(this.app !== null)
	{
		if(this.app.onDataReceived !== undefined)
		{
			this.app.onDataReceived(data);
		}
		else
		{
			console.warn("nunuStudio: Send app data communication", data);
		}
	}
	else
	{
		console.warn("nunuStudio: Data sent to app", data);
	}
};

/**
 * Serialize the object to JSON format.
 * 
 * @method toJSON
 * @param {Object} meta Metadata object passed to the objects and resources toJSON method to store data.
 * @param {boolean} exportResources If true all resouces in the program are exported, else only resources attached to objects are exported
 * @return {Object} json Serialized JSON data containing the program, all scenes and resources stored.
 */
Program.prototype.toJSON = function(meta, exportResources)
{
	var self = this;

	var data = THREE.Object3D.prototype.toJSON.call(this, meta, function(meta, object)
	{
		if(exportResources !== false)
		{
			// Textures
			var textures = self.textures;
			for(var i in textures)
			{
				var texture = textures[i];
				if(meta.textures[texture.uuid] === undefined)
				{
					meta.textures[texture.uuid] = texture.toJSON(meta);
				}
			}

			// Materials
			var materials = self.materials;
			for(var i in materials)
			{
				var material = materials[i];
				if(meta.materials[material.uuid] === undefined)
				{
					meta.materials[material.uuid] = material.toJSON(meta);
				}
			}

			// Fonts
			var fonts = self.fonts;
			for(var i in fonts)
			{
				var font = fonts[i];
				if(meta.fonts[font.uuid] === undefined)
				{
					meta.fonts[font.uuid] = font.toJSON(meta);
				}
			}

			// Audio
			var audio = self.audio;
			for(var i in audio)
			{
				var aud = audio[i];
				if(meta.audio[aud.uuid] === undefined)
				{
					meta.audio[aud.uuid] = aud.toJSON(meta);
				}
			}

			// Resources
			var resources = self.resources;
			for(var i in resources)
			{
				var resource = resources[i];
				if(meta.resources[resource.uuid] === undefined)
				{
					meta.resources[resource.uuid] = resource.toJSON(meta);
				}
			}
		}
	});

	// Initial scene
	if(this.defaultScene !== null)
	{
		data.object.defaultScene = this.defaultScene;
	}

	// Information
	data.object.author = this.author;
	data.object.description = this.description;
	data.object.version = this.version;

	// Pointer
	data.object.lockPointer = this.lockPointer;
	data.object.handlePixelRatio = this.handlePixelRatio;
	
	// VR
	data.object.vr = this.vr;
	data.object.vrScale = this.vrScale;

	// Rendering
	data.object.rendererConfig = this.rendererConfig.toJSON();

	return data;
};
