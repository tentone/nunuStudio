"use strict";

/**
 * Program class contains all the data of a nunuStudio program.
 * 
 * Program is also used to store and manage all available resources.
 * 
 * @class Program
 * @module Core
 * @constructor
 * @param {String} name Program name
 * @extends {ResourceManager}
 * @extends {ResourceManager}
 */

/**
 * NunuRuntime instance used to communication between nunu app and the host webpage
 * @property app
 * @default null
 */
/**
 * Enable virtual reality flag
 * @property vr
 * @default false
 * @type {boolean}
 */
/**
 * Virtual reality movement scale
 * @property vrScale
 * @type {Number}
 * @default 1.0
 */
/**
 * Program description
 * @property description
 * @type {String}
 */
/**
 * Program author
 * @property author
 * @type {String}
 */
/**
 * Program version
 * @property version
 * @type {String}
 * @default "0"
 */
/**
 * Antialiasing flag
 * @property antialiasing
 * @type {boolean}
 * @default false
 */
/**
 * If true the program is rendered with shadows
 * @property shadows
 * @type {boolean}
 * @default true
 */
/**
 * Shadow type
 * @property shadowsType
 * @type {Number}
 * @default PCFSoftShadowMap
 */
/**
 * Tonemapping mode
 * @property toneMapping
 * @type {Number}
 * @default NoToneMapping
 */
/**
 * Flag to control pointer locking
 * @property lockPointer
 * @type {boolean}
 * @default false
 */
/**
 * Flag to indicate if the runtime should handle device pixel ratio
 * @property handlePixelRatio
 * @type {boolean}
 * @default false
 */
/**
 * Keyboard input object
 * @property keyboard
 * @type {Keyboard}
 */
/**
 * Mouse input object
 * @property mouse
 * @type {Mouse}
 */
/**
 * Threejs WebGLRenderer being used
 * @property renderer
 * @type {WebGLRenderer}
 * @default null
 */
/**
 * Canvas being used to draw content.
 * @property canvas
 * @type {DOM}
 * @default null
 */
/**
 * DOM Division element that can be used to add html content to the app.
 * @property division
 * @type {DOM}
 * @default null
 */
function Program(name)
{
	ResourceManager.call(this);

	this.type = "Program";

	//Disable matrix auto update
	this.matrixAutoUpdate = false;

	//Pointer to nunu app
	this.app = null;

	//Program Info
	this.name = (name !== undefined) ? name : "program";
	this.description = "";
	this.author = "";
	this.version = "0";

	//Hardware flags
	this.lockPointer = false;
	this.handlePixelRatio = false;

	//VR flags
	this.vr = false;
	this.vrScale = 1;

	//Render quality
	this.antialiasing = true;
	this.shadows = true;
	this.shadowsType = THREE.PCFSoftShadowMap;
	this.toneMapping = THREE.NoToneMapping;
	this.toneMappingExposure = 1.0;
	this.toneMappingWhitePoint = 1.0;

	//Defaults
	this.defaultScene = null;
	this.defaultCamera = null;

	//Runtime variables
	this.keyboard = null;
	this.mouse = null;
	this.renderer = null;
	this.scene = null;

	this.canvas = null;
	this.division = null;

	//VR runtime objects
	this.useVR = false;
	this.display = null;
	this.effect = null;
	this.controls = null;

	//VR display present change
	var self = this;
	this.onVrDisplayPresentChange = function()
	{
		if(self.display !== null && !self.display.isPresenting)
		{
			self.useVR = false;
		}
	};

	window.addEventListener("vrdisplaypresentchange", this.onVrDisplayPresentChange, false);
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
			self.effect = new THREE.VREffect(self.renderer);
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
Program.prototype.update = function()
{
	this.scene.update();
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
			this.effect.render(this.scene, camera);
		}
	}
	//Render normally
	else
	{
		this.scene.render(renderer);
	}
};

/**
 * Resize program elements.
 * 
 * Called by the runtime every time the window is resized.
 * 
 * @method resize
 * @param {Number} x Width
 * @param {Number} y Height
 */
Program.prototype.resize = function(x, y)
{
	if(this.effect !== null)
	{
		this.effect.setSize(x, y);
	}

	//Resize cameras
	for(var i = 0; i < this.scene.cameras.length; i++)
	{
		this.scene.cameras[i].aspect = x / y;
		this.scene.cameras[i].updateProjectionMatrix();
	}

	//Resize scripts
	this.traverse(function(child)
	{
		if(child instanceof Script)
		{
			child.resize();
		}
	});
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
 * @param {Scene|String} scene
 */
Program.prototype.setScene = function(scene)
{
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
		if(this.scene.cameras.length === 0)
		{
			this.scene.cameras.push(this.defaultCamera);
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
		this.children.push(scene);
		scene.parent = this;

		//If first scene set as actual scene
		if(this.children.length === 1)
		{
			this.scene = this.children[0];
		}
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
 * Create a scene using a default template.
 * 
 * This is the scene used when creating a new program or scene inside the editor.
 * 
 * @method addDefaultScene
 * @param {Material} material Default material used by objects, if empty a new material is created
 */
Program.prototype.addDefaultScene = function(material)
{
	if(material === undefined)
	{
		material = new THREE.MeshStandardMaterial({roughness: 0.6, metalness: 0.2});
		material.name = "default";
	}

	//Create new scene
	var scene = new Scene();

	//Sky
	var sky = new Sky();
	sky.autoUpdate = false;
	scene.add(sky);

	//Box
	var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
	var model = new Mesh(geometry, material);
	model.receiveShadow = true;
	model.castShadow = true;
	model.name = "box";
	scene.add(model);

	//Floor
	model = new Mesh(geometry, material);
	model.scale.set(20, 1, 20);
 	model.position.set(0, -1.0, 0);
	model.receiveShadow = true;
	model.castShadow = true;
	model.name = "ground";
	scene.add(model);

	//Add scene to program
	this.add(scene);
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
	window.removeEventListener("vrdisplaypresentchange", this.onVrDisplayPresentChange);

	//Geometry
	for(var i in this.geometries)
	{
		this.geometries[i].dispose();
	}

	//Textures
	for(var i in this.textures)
	{
		this.textures[i].dispose();
	}
	
	//Materials
	for(var i in this.materials)
	{
		this.materials[i].dispose();
	}

	//Children objects
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}

	//VR Effect
	if(this.effect !== null)
	{
		this.effect.dispose();
	}
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
			if(child.script !== null && child.script.onAppData !== undefined)
			{
				child.appData(data);
				found = true;
			}
		}
	});

	//Show warning message
	if(!found)
	{
		if(typeof data === "object")
		{
			console.warn("nunuStudio: No script with onAppData found", JSON.stringify(data));
		}
		else
		{
			console.warn("nunuStudio: No script with onAppData found", data);
		}
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
			console.warn("nunuStudio: App data communication", data);
		}
	}
	else
	{
		if(typeof data === "object")
		{
			console.warn("nunuStudio: No app available", JSON.stringify(data));
		}
		else
		{
			console.warn("nunuStudio: No app available", data);
		}
	}
};

/**
 * Serialize object to JSON.
 * 
 * @method toJSON
 * @param {Object} meta
 * @param {boolean} exportResources If true all resouces in the program are exported, else only resources attached to objects are exported
 * @return {Object} json
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
