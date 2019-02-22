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
 * @param {String} name Program name
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
	 * @property name
	 * @type {String}
	 */
	this.name = (name !== undefined) ? name : "program";

	/**
	 * Program description.
	 *
	 * @property description
	 * @type {String}
	 */
	this.description = "";

	/**
	 * Program author.
	 *
	 * @property author
	 * @type {String}
	 */
	this.author = "";

	/**
	 * Program version.
	 *
	 * @property version
	 * @type {String}
	 * @default "0"
	 */
	this.version = "0";

	/**
	 * Flag to control pointer locking.
	 *
	 * @property lockPointer
	 * @type {boolean}
	 * @default false
	 */
	this.lockPointer = false;

	/**
	 * Flag to indicate if the runtime should handle device pixel ratio.
	 *
	 * @property handlePixelRatio
	 * @type {boolean}
	 * @default false
	 */
	this.handlePixelRatio = false;

	/**
	 * Enable virtual reality flag.
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
	 * @type {Number}
	 * @default 1.0
	 */
	this.vrScale = 1;

	/**
	 * Antialiasing flag.
	 *
	 * @property antialiasing
	 * @type {boolean}
	 * @default false
	 */
	this.antialiasing = true;

	/**
	 * If true the program is rendered with shadows
	 * @property shadows
	 * @type {boolean}
	 * @default true
	 */
	this.shadows = true;

	/**
	 * Shadow map filtering type.
	 *
	 * @property shadowsType
	 * @type {Number}
	 * @default PCFSoftShadowMap
	 */
	this.shadowsType = THREE.PCFSoftShadowMap;

	/**
	 * Tone mapping mode.
	 *
	 * @property toneMapping
	 * @type {Number}
	 * @default THREE.NoToneMapping
	 */
	this.toneMapping = THREE.NoToneMapping;

	/**
	 * Exposure level of tone mapping.
	 *
	 * @property toneMappingExposure
	 * @type {Number}
	 */
	this.toneMappingExposure = 1.0;

	/**
	 * Tone mapping white point.
	 *
	 * @property toneMappingWhitePoint
	 * @type {Number}
	 */
	this.toneMappingWhitePoint = 1.0;

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
	 * Keyboard input object.
	 *
	 * @property keyboard
	 * @type {Keyboard}
	 */
	this.keyboard = null;

	/**
	 * Mouse input object.
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
	 * Scene currently running in the program.
	 *
	 * @property scene
	 * @type {Scene}
	 */
	this.scene = null;

	/**
	 * Canvas being used to draw content.
	 *
	 * This canvas is where the WebGL rendering context was created.
	 *
	 * @property canvas
	 * @type {DOM}
	 */
	this.canvas = null;

	/**
	 * DOM Division element that can be used to add html content to the app.
	 *
	 * All content added to this division should be manually removed before the app exits.
	 *
	 * @property division
	 * @type {DOM}
	 */
	this.division = null;

	//VR runtime objects
	this.useVR = false;
	this.display = null;
	this.effect = null;
	this.controls = null;
		
	/**
	 * Event manager used to handle VR display presentation change event.
	 *
	 * @propety manager
	 * @type {EventManager}
	 */
	this.manager = new EventManager();
	this.manager.add(window, "vrdisplaypresentchange", function()
	{
		if(self.display !== null && !self.display.isPresenting)
		{
			self.useVR = false;
		}
	});
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

	//If input null create input object
	if(this.mouse === null)
	{
		this.mouse = new Mouse();
	}

	if(this.keyboard === null)
	{
		this.keyboard = new keyboard();
	}

	//Get default scene
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

	if(this.vr)
	{
		var self = this;

		Nunu.getVRDisplays(function(display)
		{
			self.display = display;
			self.controls = new VRControls();
			self.effect = new VREffect(self.renderer);
		});
	}
};

/**
 * Set program mouse and keyboard.
 * 
 * @method setMouseKeyboard
 * @param {Mouse} mouse
 * @param {Keyboard} keyboard
 */
Program.prototype.setMouseKeyboard = function(mouse, keyboard)
{
	this.mouse = mouse;
	this.keyboard = keyboard;
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
Program.prototype.update = function(delta)
{
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
	//Render as a VR application (ignores all camera parameters and effects)
	if(this.useVR)
	{
		for(var i = 0; i < this.scene.cameras.length; i++)
		{
			var camera = this.scene.cameras[i];
			this.controls.update(camera);
			this.effect.render(this.scene, camera, undefined, true);
		}
	}
	//Render normally
	else
	{
		this.scene.render(renderer);
	}
};

/**
 * Resize the current scene elements.
 * 
 * @method resize
 * @param {Number} x Width.
 * @param {Number} y Height.
 */
Program.prototype.resize = function(x, y)
{
	//Resize vr effect
	if(this.effect !== null)
	{
		this.effect.setSize(x, y);
	}

	//Resize the default camera
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
		this.renderer.shadowMap.enabled = this.shadows;
		this.renderer.shadowMap.type = this.shadowsType;
		this.renderer.toneMapping = this.toneMapping;
		this.renderer.toneMappingExposure = this.toneMappingExposure;
		this.renderer.toneMappingWhitePoint = this.toneMappingWhitePoint;
	}
};

/**
 * Enter virtual reality mode.
 *
 * To enter virtual reality mode a WebVR enabled browser is required.
 *
 * When displaying VR content the display.requestAnimationFrame should be used to call the render method.
 * 
 * @method displayVR
 */
Program.prototype.displayVR = function()
{
	if(this.vr)
	{
		try
		{
			if(!this.display.isPresenting)
			{
				this.display.requestPresent([{source : this.canvas}]);
				this.useVR = true;
			}
		}
		catch(e)
		{
			console.warn("nunuStudio: Failed to enter in VR mode", e);
		}		
	}
};

/**
 * Exit virtual relity mode.
 * 
 * @method exitVR
 */
Program.prototype.exitVR = function()
{
	if(this.display.isPresenting)
	{
		this.display.exitPresent();
		this.useVR = false;
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
	if(this.scene !== null)
	{
		this.scene.dispose();
	}

	if(scene instanceof Scene)
	{
		this.scene = scene;
	}
	else if(typeof scene === "string")
	{
		this.scene = this.getObjectByName(scene);
	}

	if(this.scene !== null)
	{
		if(this.scene.defaultCamera === null)
		{
			this.scene.defaultCamera = this.defaultCamera;
		}

		this.scene.initialize();
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
		//Remove scene from the children list
		var index = this.children.indexOf(scene);
		if(index > -1)
		{
			this.children.splice(index, 1);
			scene.parent = null;
		}

		//If the scene remove was in use, dispose it
		if(scene === this.scene)
		{
			this.scene.dispose();
			this.scene = null;
		}
		
		//If there are no scenes on program set actual scene to null
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

		//If first scene set as actual scene
		if(this.children.length === 1)
		{
			this.scene = this.children[0];
		}
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
 * @param {String} uuid Scene uuid
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

	if(this.effect !== null)
	{
		this.effect.dispose();
	}

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

	//Check if there is a script with onAppData method available
	this.traverse(function(child)
	{
		if(child instanceof Script)
		{
			child.appData(data);
			found = true;
		}
	});

	//Show warning message
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
			//Textures
			var textures = self.textures;
			for(var i in textures)
			{
				var texture = textures[i];
				if(meta.textures[texture.uuid] === undefined)
				{
					meta.textures[texture.uuid] = texture.toJSON(meta);
				}
			}

			//Materials
			var materials = self.materials;
			for(var i in materials)
			{
				var material = materials[i];
				if(meta.materials[material.uuid] === undefined)
				{
					meta.materials[material.uuid] = material.toJSON(meta);
				}
			}

			//Fonts
			var fonts = self.fonts;
			for(var i in fonts)
			{
				var font = fonts[i];
				if(meta.fonts[font.uuid] === undefined)
				{
					meta.fonts[font.uuid] = font.toJSON(meta);
				}
			}

			//Audio
			var audio = self.audio;
			for(var i in audio)
			{
				var aud = audio[i];
				if(meta.audio[aud.uuid] === undefined)
				{
					meta.audio[aud.uuid] = aud.toJSON(meta);
				}
			}

			//Resources
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

	//Initial scene
	if(this.defaultScene !== null)
	{
		data.object.defaultScene = this.defaultScene;
	}

	//Information
	data.object.author = this.author;
	data.object.description = this.description;
	data.object.version = this.version;

	//Pointer
	data.object.lockPointer = this.lockPointer;
	data.object.handlePixelRatio = this.handlePixelRatio;
	
	//VR
	data.object.vr = this.vr;
	data.object.vrScale = this.vrScale;

	//Rendering
	data.object.antialiasing = this.antialiasing;
	data.object.shadows = this.shadows;
	data.object.shadowsType = this.shadowsType;
	data.object.toneMapping = this.toneMapping;
	data.object.toneMappingExposure = this.toneMappingExposure;
	data.object.toneMappingWhitePoint = this.toneMappingWhitePoint;

	return data;
};
