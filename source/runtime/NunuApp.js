"use strict";

//Nunu global
include("Nunu.js");

//Runtime dependencies
include("lib/three/three.min.js");
include("lib/three/effects/VREffect.js");

include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/stats.min.js");
include("lib/SPE.min.js");
include("lib/spine.min.js");
include("lib/opentype.min.js");

//Core runtime modules
include("core/Global.js");
include("core/FileSystem.js");

include("core/three/Object3D.js");
include("core/three/Vector3.js");
include("core/three/Vector2.js");
include("core/three/Texture.js");
include("core/three/LightShadow.js");
include("core/three/Fog.js");
include("core/three/Material.js");
include("core/three/MultiMaterial.js");

include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");

include("core/controls/VRControls.js");

include("core/resources/Resource.js");
include("core/resources/Font.js");
include("core/resources/Video.js");
include("core/resources/Audio.js");
include("core/resources/Image.js");
include("core/resources/ResourceManager.js");

include("core/texture/Texture.js");
include("core/texture/CanvasTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/CubeTexture.js");

include("core/loaders/FontLoader.js");
include("core/loaders/ImageLoader.js");
include("core/loaders/VideoLoader.js");
include("core/loaders/AudioLoader.js");
include("core/loaders/MaterialLoader.js");
include("core/loaders/TextureLoader.js");
include("core/loaders/ObjectLoader.js");
include("core/loaders/TTFLoader.js");

include("core/objects/device/LeapMotion.js");
include("core/objects/device/KinectDevice.js");
include("core/objects/mesh/Mesh.js");
include("core/objects/mesh/SkinnedMesh.js");
include("core/objects/mesh/Text3D.js");
include("core/objects/sprite/Sprite.js");
include("core/objects/lights/PointLight.js");
include("core/objects/lights/SpotLight.js");
include("core/objects/lights/AmbientLight.js");
include("core/objects/lights/DirectionalLight.js");
include("core/objects/lights/HemisphereLight.js");
include("core/objects/lights/RectAreaLight.js");
include("core/objects/lights/Sky.js");
include("core/objects/cameras/PerspectiveCamera.js");
include("core/objects/cameras/OrthographicCamera.js");
include("core/objects/audio/AudioEmitter.js");
include("core/objects/audio/PositionalAudio.js");
include("core/objects/script/Script.js");
include("core/objects/physics/PhysicsObject.js");
include("core/objects/spine/SpineAnimation.js");
include("core/objects/spine/SpineTexture.js");
include("core/objects/particle/ParticleEmitter.js");
include("core/objects/animation/Bone.js");
include("core/objects/misc/Container.js");
include("core/objects/Program.js");
include("core/objects/Scene.js");

include("core/utils/Base64Utils.js");
include("core/utils/ArraybufferUtils.js");
include("core/utils/MathUtils.js");
include("core/utils/ObjectUtils.js");
include("core/utils/BufferUtils.js");

/**
 * NunuApp is used to load .isp files into a webpage, it controls all the runtime elements necessary to embed nunu apps anywhere
 * @class NunuApp
 * @module Runtime
 * @constructor
 * @param {DOM} canvas Canvas to be used by the runtime, if no canvas is provided a new one is created and added to the document.body
 */

/**
 * Nunu Program
 * @property program
 * @type {Program}
 */

/**
 * Graphics renderer in use by this NunuApp instance
 * @property renderer
 * @type {THREE.Renderer}
 */

/**
 * Fullscreen flag, to set fulscreen mode the setFullScreen method should be used
 * @property fullscreen
 * @type {boolean}
 * @default false
 */

/**
 * VR flag, to set VR mode the toggleVR method should be used
 * @property vr
 * @type {boolean}
 * @default false
 */

/**
 * Canvas used to render graphics
 * @property canvas
 * @type {DOM}
 */

/**
 * Flag used to controll if the canvas element is resized automatically by the nunu app instance.
 * 
 * If true the canvas is resized whenether the resize method is called.
 * 
 * @property canvasResize
 * @type {boolean}
 * @default false if a canvas is provided, else true
 */
//Nunu app contructor
function NunuApp(canvas)
{
	//Program and renderer
	this.program = null;
	this.renderer = null;

	//Fullscreen controll
	this.fullscreen = false;
	this.vr = false;

	//Canvas
	if(canvas === undefined)
	{
		this.canvas = document.createElement("canvas");
		this.canvas.style.position = "absolute";
		this.canvas.style.left = "0px";
		this.canvas.style.top = "0px";
		this.canvas.style.width = window.innerWidth + "px";
		this.canvas.style.height = window.innerHeight + "px";
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		
		document.body.appendChild(this.canvas);

		this.canvasResize = true;
	}
	else
	{
		this.canvas = canvas;
		this.canvasResize = false;
	}

	//Lock pointer function
	var canvas = this.canvas;
	this.lockMouse = function()
	{
		if(canvas.requestPointerLock)
		{
			canvas.requestPointerLock();
		}
		else if(canvas.mozRequestPointerLock)
		{
			canvas.mozRequestPointerLock();
		}
		else if(canvas.webkitRequestPointerLock)
		{
			canvas.webkitRequestPointerLock();
		}
	};
}

/**
 * Load program asynchronously and run it after its loaded.
 * 
 * @method loadRunProgram
 * @param {String} fname Name of the file to load
 * @param {Function} onLoad onLoad callback
 * @param {Function} onProgress onProgress callback
 */
NunuApp.prototype.loadRunProgram = function(fname, onLoad, onProgress)
{
	var loader = new ObjectLoader();
	var app = this;

	FileSystem.readFile(fname, false, function(data)
	{
		app.program = loader.parse(JSON.parse(data));
		app.run();

		if(onLoad !== undefined)
		{
			onLoad();
		}
	}, onProgress);
}

/**
 * Load program from file.
 * 
 * @method loadProgram
 * @param {String} fname Name of the file to load
 */
NunuApp.prototype.loadProgram = function(fname)
{
	var loader = new ObjectLoader();
	var data = FileSystem.readFile(fname);
	this.program = loader.parse(JSON.parse(data));
}

/**
 * Start running nunu program.
 * 
 * A nunu program must be loaded before calling this method.
 * 
 * @method run
 */
NunuApp.prototype.run = function()
{
	if(this.program === null)
	{
		console.warn("nunuStudio: no program is loaded [app.loadPogram(fname)]");
		return;
	}

	//WebGL renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
	this.renderer.autoClear = false;
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFShadowMap;
	this.renderer.setSize(this.canvas.width, this.canvas.height);

	//Mouse and Keyboard input
	this.keyboard = new Keyboard();
	this.mouse = new Mouse();
	this.mouse.setCanvas(this.canvas);

	//Attach this runtime to program
	this.program.app = this;

	//Create default camera
	this.program.defaultCamera = new PerspectiveCamera(60, this.canvas.width/this.canvas.height, 0.1, 1000000);
	this.program.defaultCamera.position.set(0, 5, -5);

	//Set renderer
	this.program.setRenderer(this.renderer);
	this.program.setMouseKeyboard(this.mouse, this.keyboard);
	
	//Initialize program
	this.program.initialize();
	this.program.resize(this.canvas.width, this.canvas.height);

	//Lock mouse pointer
	if(this.program.lockPointer)
	{
		this.canvas.addEventListener("click", this.lockMouse, false);
	}

	//Update loop
	var self = this;
	var update = function()
	{
		if(self.program !== null)
		{
			requestAnimationFrame(update);
			self.update();
		}
	};
	update();
}

/**
 * Update nunu program state.
 * 
 * Automatically called by the runtime handler.
 * 
 * @method update
 */
NunuApp.prototype.update = function()
{
	this.mouse.update();
	this.keyboard.update();

	this.program.update();
	this.program.render(this.renderer);
}

/**
 * Exit from app.
 * 
 * This method kills the app and disposes all internal elements to avoid memory leaks.
 * 
 * Is should be called before exiting the webpage or before switching nunu programs.
 * 
 * When loading new nunu programs the same NunuApp instance can be used.
 * 
 * @method exit
 */
NunuApp.prototype.exit = function()
{
	//Remove mouse lock event from canvas
	if(this.program.lockPointer)
	{
		this.canvas.removeEventListener("click", this.lockMouse, false);
	}

	//Dispose and remove program
	if(this.program !== null)
	{
		this.program.dispose();
		this.program = null;
	}

	//Dispose keyboard and mouse
	this.mouse.dispose();
	this.keyboard.dispose();

	//Run onExit callback if any
	if(this.onExit !== undefined)
	{
		this.onExit();
	}
}

/**
 * Resize the window.
 * 
 * Should be called whenether the host window is resized.
 * 
 * @method resize
 */
NunuApp.prototype.resize = function()
{
	if(this.canvas !== null && this.canvasResize)
	{
		this.canvas.style.width = window.innerWidth + "px";
		this.canvas.style.height = window.innerHeight + "px";
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
	
	if(this.program !== null && this.renderer !== null)
	{
		this.renderer.setSize(this.canvas.width, this.canvas.height);
		this.program.resize(this.canvas.width, this.canvas.height);
	}
}

/**
 * Send data to running nunu application.
 * 
 * The data sent using this method is received by scripts that implement the onAppData method.
 * 
 * @param {Object} data Data to send
 * @method sendData
 */
NunuApp.prototype.sendData = function(data)
{
	if(this.program !== null)
	{
		this.program.receiveDataApp(data);
	}
}

/**
 * Set on data receive callback.
 * 
 * Callback receives data as an argument.
 * 
 * @method setOnDataReceived
 * @param {Function} callback Function executed whenether the nunu app running sends data to the host
 */
NunuApp.prototype.setOnDataReceived = function(callback)
{
	this.onDataReceived = callback;
}

/**
 * Set on exit callback.
 * 
 * Callback is executed when exiting the nunu app.
 * 
 * @method setOnExit
 * @param {Function} callback onExit callback
 */
NunuApp.prototype.setOnExit = function(callback)
{
	this.onExit = callback;
}

/**
 * Check if VR mode is available.
 * 
 * @method vrAvailable
 * @return {boolean} True if VR mode available
 */
NunuApp.prototype.vrAvailable = function()
{
	return this.program.vr && Nunu.webvrAvailable();	
}

/**
 * Toggle VR mode, only works if VR mode is available.
 * 
 * @method toggleVR
 */
NunuApp.prototype.toggleVR = function()
{
	if(this.vrAvailable())
	{
		if(this.vr)
		{
			this.program.exitVR();
			this.vr = false;
		}
		else
		{
			this.program.displayVR();
			this.vr = true;
		}
	}
	else
	{
		console.warn("nunuStudio: loaded program is not VR enabled");
	}
}

/**
 * Set fullscreen mode
 * 
 * @param {boolean} fullscreen If true go to fullscren if false exit fullscreen mode
 * @param {DOM} element DOM element to go fullscren by default the rendering canvas is used
 */
NunuApp.prototype.setFullscreen = function(fullscreen, element)
{
	if(fullscreen !== undefined)
	{
		this.fullscreen = fullscreen;
	}
	else
	{
		this.fullscreen = !this.fullscreen;
	}

	if(this.fullscreen)
	{
		if(element === undefined)
		{
			element = this.canvas;
		}
		
		element.requestFullscreen = element.requestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
		
		if(element.requestFullscreen)
		{
			element.requestFullscreen();
		}
	}
	else
	{
		document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
		
		if(document.exitFullscreen)
		{
			document.exitFullscreen();
		}
	}
}
