"use strict";

include("Nunu.js");

include("lib/three/three.js");

include("lib/three/effects/VREffect.js");

include("lib/three/shaders/CopyShader.js");
include("lib/three/shaders/BokehShader.js");
include("lib/three/shaders/SAOShader.js");
include("lib/three/shaders/DepthLimitedBlurShader.js");
include("lib/three/shaders/UnpackDepthRGBAShader.js");
include("lib/three/shaders/ConvolutionShader.js");
include("lib/three/shaders/LuminosityHighPassShader.js");
include("lib/three/shaders/FXAAShader.js");
include("lib/three/shaders/SSAOShader.js");
include("lib/three/shaders/FilmShader.js");
include("lib/three/shaders/DotScreenShader.js");
include("lib/three/shaders/LuminosityShader.js");
include("lib/three/shaders/SobelOperatorShader.js");
include("lib/three/shaders/ColorifyShader.js");
include("lib/three/shaders/ToneMapShader.js");
include("lib/three/shaders/TechnicolorShader.js");
include("lib/three/shaders/HueSaturationShader.js");

include("lib/three/postprocessing/EffectComposer.js");
include("lib/three/postprocessing/RenderPass.js");
include("lib/three/postprocessing/ShaderPass.js");
include("lib/three/postprocessing/MaskPass.js");

include("lib/three/curves/NURBSCurve.js");
include("lib/three/curves/NURBSSurface.js");
include("lib/three/curves/NURBSUtils.js");

include("lib/three/loaders/TTFLoader.js");

include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/SPE.min.js");
include("lib/spine.js");
include("lib/opentype.min.js");

include("lib/bytebuffer.min.js");
include("lib/long.min.js");
include("lib/PSON.min.js");

include("core/Global.js");
include("core/FileSystem.js");

include("core/three/animation/KeyframeTrack.js");
include("core/three/animation/AnimationClip.js");
include("core/three/core/Object3D.js");
include("core/three/core/BufferGeometry.js");
include("core/three/cameras/Camera.js");
include("core/three/materials/Material.js");
include("core/three/materials/MultiMaterial.js");
include("core/three/loaders/BufferGeometryLoader.js");
include("core/three/math/Vector3.js");
include("core/three/textures/Texture.js");
include("core/three/lights/LightShadow.js");
include("core/three/scenes/Fog.js");

include("core/animation/AnimationMixer.js");

include("core/input/Key.js");
include("core/input/Keyboard.js");
include("core/input/Mouse.js");
include("core/input/Gamepad.js");
include("core/input/Gyroscope.js");

include("core/postprocessing/Pass.js");
include("core/postprocessing/ShaderPass.js");
include("core/postprocessing/EffectComposer.js");

include("core/postprocessing/pass/RenderPass.js");
include("core/postprocessing/pass/UnrealBloomPass.js");
include("core/postprocessing/pass/FXAAPass.js");
include("core/postprocessing/pass/SSAOPass.js");
include("core/postprocessing/pass/BokehPass.js");
include("core/postprocessing/pass/CopyPass.js");
include("core/postprocessing/pass/FilmPass.js");
include("core/postprocessing/pass/DotScreenPass.js");
include("core/postprocessing/pass/SobelPass.js");
include("core/postprocessing/pass/ColorifyPass.js");
include("core/postprocessing/pass/TechnicolorPass.js");
include("core/postprocessing/pass/HueSaturationPass.js");

include("core/controls/VRControls.js");

include("core/resources/Resource.js");
include("core/resources/Font.js");
include("core/resources/Video.js");
include("core/resources/Audio.js");
include("core/resources/Image.js");
include("core/resources/Model.js");
include("core/resources/TextFile.js");
include("core/resources/ResourceManager.js");

include("core/texture/Texture.js");
include("core/texture/CanvasTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/CubeTexture.js");
include("core/texture/CompressedTexture.js");
include("core/texture/SpriteSheetTexture.js");

include("core/loaders/FontLoader.js");
include("core/loaders/ImageLoader.js");
include("core/loaders/VideoLoader.js");
include("core/loaders/AudioLoader.js");
include("core/loaders/MaterialLoader.js");
include("core/loaders/TextureLoader.js");
include("core/loaders/GeometryLoader.js");
include("core/loaders/ObjectLoader.js");

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
include("core/objects/misc/Container.js");
include("core/objects/misc/CubeCamera.js");
include("core/objects/misc/LensFlare.js");
include("core/objects/animation/Skeleton.js");
include("core/objects/controls/OrbitControls.js");
include("core/objects/controls/FirstPersonControls.js");
include("core/objects/Program.js");
include("core/objects/Scene.js");

include("core/utils/binary/Base64Utils.js");
include("core/utils/binary/ArraybufferUtils.js");
include("core/utils/binary/BufferUtils.js");

include("core/utils/Timer.js");
include("core/utils/AnimationTimer.js");
include("core/utils/EventManager.js");

include("core/utils/MathUtils.js");
include("core/utils/ObjectUtils.js");
include("core/utils/Mesh2shape.js");

/**
 * NunuApp is the main class of the runtime system, is used to embed nunu application into a webpage.
 *
 * .isp files can be loaded directly into webpages.
 * 
 * @class NunuApp
 * @module Runtime
 * @constructor
 * @param {DOM} canvas Canvas to be used by the runtime, if no canvas is provided a new one is created and added to the document.body, to create a new NunuApp without canvas a null value can be passed.
 */

/**
 * Nunu Program
 * @property program
 * @type {Program}
 */

/**
 * Graphics renderer in use by this NunuApp instance
 * @property renderer
 * @type {Renderer}
 */

/**
 * VR flag, to set VR mode the toggleVR method should be used
 * @property vr
 * @type {boolean}
 * @default false
 */

/**
 * Canvas used to render graphics.
 * @property canvas
 * @type {DOM}
 */

/**
 * Flag used to controll if the canvas element is resized automatically by the nunu app instance.
 * 
 * If true the canvas is resized whenether the resize method is called.
 * 
 * @property canvasFitWindow
 * @type {boolean}
 * @default false if a canvas is provided, else true
 */

/**
 * Lock and hide mouse pointer to the canvas.
 *
 * @method lockMouse
 */
function NunuApp(canvas)
{
	//Program and renderer
	this.program = null;
	this.renderer = null;

	//Runtime control
	this.running = false;

	//Event manager
	this.events = new EventManager();

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
		this.canvasFitWindow = true;
	}
	else
	{
		this.canvas = canvas;
		this.canvasFitWindow = false;
	}
}

/**
 * Load a nunustudio application and attach it to the canvas indicated.
 *
 * This method automatically creates resize events, this single line should be enough to make a nunuStudio app run in a webpage.
 *
 * @static
 * @method loadApp
 * @param {URL} url URL for the nsp or isp nunuStudio file.
 * @param {String} canvas Canvas object or canvas id.
 */
NunuApp.loadApp = function(url, canvas)
{	
	if(typeof canvas === "string")
	{
		canvas = document.getElementById(canvas);
	}

	var app = new NunuApp(canvas);
	app.loadRunProgram(url);

	window.addEventListener("resize", function()
	{
		if(Nunu.isFullscreen())
		{
			app.canvas.width = window.innerWidth;
			app.canvas.height = window.innerHeight;
		}
		else
		{
			app.canvas.width = nunuApps[i].canvas.parentElement.offsetWidth * 0.8;
			app.canvas.height = nunuApps[i].canvas.parentElement.offsetWidth * 0.4;
		}
		app.resize();
	});
};

/**
 * Start running nunu program.
 *
 * Creates renderer, mouse and keyboard objects, and starts running the loaded application.
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
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, alpha: true, antialias: this.program.antialiasing});
	this.renderer.shadowMap.enabled = this.program.shadows;
	this.renderer.shadowMap.type = this.program.shadowsType;
	this.renderer.toneMapping = this.program.toneMapping;
	this.renderer.toneMappingExposure = this.program.toneMappingExposure;
	this.renderer.toneMappingWhitePoint = this.program.toneMappingWhitePoint;
	this.renderer.setSize(this.canvas.width, this.canvas.height);
	
	if(this.program.handlePixelRatio)
	{
		this.renderer.setPixelRatio(window.devicePixelRatio);
	}
	
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
		var canvas = this.canvas;
		canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;

		this.events.add(canvas, "click", function()
		{
			if(canvas.requestPointerLock)
			{
				canvas.requestPointerLock();
			}
		});
	}

	var self = this;
	this.events.add(window, "beforeunload", function()
	{
		self.exit();
	});

	this.events.create();
	this.resume();
};

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
	this.loadProgramAsync(fname, function(app)
	{
		app.run();

		if(onLoad !== undefined)
		{
			onLoad(app);
		}
	}, onProgress);
};

/**
 * Load program from file.
 * 
 * @method loadProgram
 * @param {String} fname Name of the file to load
 */
NunuApp.prototype.loadProgram = function(fname)
{
	//JSON project
	if(fname.endsWith(".isp"))
	{
		var loader = new ObjectLoader();
		var data = FileSystem.readFile(fname);
		this.program = loader.parse(JSON.parse(data));
	}
	//Binary project
	else if(fname.endsWith(".nsp"))
	{
		var loader = new ObjectLoader();
		var data = FileSystem.readFileArrayBuffer(fname);
		var pson = new dcodeIO.PSON.StaticPair();
		this.program = loader.parse(pson.decode(data));
	}
};

/**
 * Load program from file, asynchronously.
 * 
 * @method loadProgramAsync
 * @param {String} fname Name of the file to load
 * @param {Function} onLoad onLoad callback. Receives as argument the loaded application.
 * @param {Function} onProgress onProgress callback
 */
NunuApp.prototype.loadProgramAsync = function(fname, onLoad, onProgress)
{
	var self = this;

	//JSON project
	if(fname.endsWith(".isp"))
	{
		FileSystem.readFile(fname, false, function(data)
		{
			var loader = new ObjectLoader();
			self.program = loader.parse(JSON.parse(data));
			
			if(onLoad !== undefined)
			{
				onLoad(self);
			}
		}, onProgress);
	}
	//Binary project
	else if(fname.endsWith(".nsp"))
	{
		FileSystem.readFileArrayBuffer(fname, false, function(data)
		{
			var loader = new ObjectLoader();
			var pson = new dcodeIO.PSON.StaticPair();
			self.program = loader.parse(pson.decode(data));

			if(onLoad !== undefined)
			{
				onLoad(self);
			}
		}, onProgress);
	}
};

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
};

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
	//Destroy events
	this.events.destroy();

	//Dispose program
	if(this.program !== null)
	{
		this.program.dispose();
		this.program = null;
	}

	//Dispose renderer
	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer = null;
	}

	//Dispose mouse
	if(this.mouse !== null)
	{
		this.mouse.dispose();
		this.mouse = null;
	}

	//Dispose keyboard
	if(this.keyboard !== null)
	{
		this.keyboard.dispose();
		this.keyboard = null;
	}

	//Run onExit callback if any
	if(this.onExit !== undefined)
	{
		this.onExit();
	}
};

/**
 * Start or resume the paused application.
 *
 * Starts a new update cycle and sets the running flag.
 *
 * @method resume
 */
NunuApp.prototype.resume = function()
{
	if(this.program !== null && !this.running)
	{
		var self = this;
		var update = function()
		{
			if(self.running)
			{
				self.update();

				if(self.program.useVR)
				{
					self.program.display.requestAnimationFrame(update);
				}
				else
				{
					requestAnimationFrame(update);
				}
			}
		};

		this.running = true;
		update();
	}
};

/**
 * Pause the running application.
 *
 * @method pause
 */
NunuApp.prototype.pause = function()
{
	this.running = false;
};

/**
 * Set the canvas to be used for rendering.
 *
 * Should be set before starting the program.
 *
 * @method setCanvas
 * @param {DOM} canvas Canvas
 */
NunuApp.prototype.setCanvas = function(canvas)
{
	this.canvas = canvas;
	this.canvasFitWindow = false;
};

/**
 * Resize the window.
 * 
 * Should be called whenether the host window is resized.
 * 
 * @method resize
 */
NunuApp.prototype.resize = function()
{
	if(this.canvas !== null && this.canvasFitWindow)
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
};

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
};

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
};

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
};

/**
 * Check if virtual reality mode is available.
 * 
 * @method vrAvailable
 * @return {boolean} True if VR mode available
 */
NunuApp.prototype.vrAvailable = function()
{
	return this.program !== null && this.program.vr && Nunu.webvrAvailable();	
};

/**
 * Toggle VR mode, only works if VR mode is available.
 * 
 * @method toggleVR
 */
NunuApp.prototype.toggleVR = function()
{
	if(this.vrAvailable())
	{
		if(this.program.useVR)
		{
			this.program.exitVR();
		}
		else
		{
			this.program.displayVR();
		}
	}
	else
	{
		console.warn("nunuStudio: loaded program is not VR enabled");
	}
};

/**
 * Set a element to fullscreen mode, if none is passed the rendering canvas is used.
 *
 * @method toggleFullscreen
 * @param {DOM} element DOM element to go fullscren by default the rendering canvas is used
 */
NunuApp.prototype.toggleFullscreen = function(element)
{
	var fullscreen = Nunu.isFullscreen();

	//Enter fullscreen
	if(!fullscreen)
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
	//Exit fullscreen
	else
	{
		document.exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
		
		if(document.exitFullscreen)
		{
			document.exitFullscreen();
		}
	}
};
