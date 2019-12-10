"use strict";

include("lib/three/three.js");

include("lib/three/QuickHull.js");
include("lib/three/SimplexNoise.js");

include("lib/three/shaders/AfterimageShader.js");
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

include("lib/three/objects/Lensflare.js");

include("lib/three/loaders/TTFLoader.js");

include("lib/pson/bytebuffer.min.js");
include("lib/pson/long.min.js");
include("lib/pson/PSON.min.js");

include("lib/three-bmfont.js");
include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/spine-threejs.js");
include("lib/opentype.min.js");
include("lib/chevrotain.min.js");

include("source/core/Nunu.js");
include("source/core/Global.js");
include("source/core/FileSystem.js");
include("source/core/TargetConfig.js");

include("source/core/three/animation/KeyframeTrack.js");
include("source/core/three/animation/AnimationClip.js");
include("source/core/three/core/Object3D.js");
include("source/core/three/core/BufferGeometry.js");
include("source/core/three/cameras/Camera.js");
include("source/core/three/materials/Material.js");
include("source/core/three/loaders/BufferGeometryLoader.js");
include("source/core/three/textures/Texture.js");
include("source/core/three/lights/LightShadow.js");
include("source/core/three/scenes/Fog.js");
include("source/core/three/objects/Points.js");

include("source/core/animation/AnimationMixer.js");

include("source/core/input/Key.js");
include("source/core/input/Keyboard.js");
include("source/core/input/TizenKeyboard.js");
include("source/core/input/Mouse.js");
include("source/core/input/Gamepad.js");
include("source/core/input/Gyroscope.js");

include("source/core/renderer/RendererState.js");
include("source/core/renderer/RendererConfiguration.js");
include("source/core/renderer/css/CSS3DRenderer.js");
include("source/core/renderer/css/CSS3DObject.js");
include("source/core/renderer/css/CSS3DSprite.js");

include("source/core/postprocessing/Pass.js");
include("source/core/postprocessing/ShaderPass.js");
include("source/core/postprocessing/EffectComposer.js");
include("source/core/postprocessing/RenderPass.js");

include("source/core/postprocessing/pass/antialiasing/FXAAPass.js");
include("source/core/postprocessing/pass/AfterimagePass.js");
include("source/core/postprocessing/pass/UnrealBloomPass.js");
include("source/core/postprocessing/pass/BloomPass.js");
include("source/core/postprocessing/pass/SSAONOHPass.js");
include("source/core/postprocessing/pass/SSAOPass.js");
include("source/core/postprocessing/pass/BokehPass.js");
include("source/core/postprocessing/pass/CopyPass.js");
include("source/core/postprocessing/pass/FilmPass.js");
include("source/core/postprocessing/pass/DotScreenPass.js");
include("source/core/postprocessing/pass/SobelPass.js");
include("source/core/postprocessing/pass/ColorifyPass.js");
include("source/core/postprocessing/pass/TechnicolorPass.js");
include("source/core/postprocessing/pass/HueSaturationPass.js");
include("source/core/postprocessing/pass/AdaptiveToneMappingPass.js");

include("source/core/postprocessing/shaders/SSAOShader.js");

include("source/core/resources/Resource.js");
include("source/core/resources/Font.js");
include("source/core/resources/Video.js");
include("source/core/resources/Audio.js");
include("source/core/resources/Image.js");
include("source/core/resources/Model.js");
include("source/core/resources/TextFile.js");
include("source/core/resources/ResourceManager.js");
include("source/core/resources/stream/VideoStream.js");

include("source/core/texture/Texture.js");
include("source/core/texture/CanvasTexture.js");
include("source/core/texture/VideoTexture.js");
include("source/core/texture/WebcamTexture.js");
include("source/core/texture/CubeTexture.js");
include("source/core/texture/CompressedTexture.js");
include("source/core/texture/SpriteSheetTexture.js");

include("source/core/loaders/FontLoader.js");
include("source/core/loaders/ImageLoader.js");
include("source/core/loaders/VideoLoader.js");
include("source/core/loaders/AudioLoader.js");
include("source/core/loaders/MaterialLoader.js");
include("source/core/loaders/TextureLoader.js");
include("source/core/loaders/GeometryLoader.js");
include("source/core/loaders/LegacyGeometryLoader.js");
include("source/core/loaders/ObjectLoader.js");

include("source/core/objects/device/LeapMotion.js");
include("source/core/objects/device/KinectDevice.js");

include("source/core/objects/mesh/Mesh.js");
include("source/core/objects/mesh/SkinnedMesh.js");

include("source/core/objects/sprite/CanvasSprite.js");
include("source/core/objects/sprite/Sprite.js");

include("source/core/objects/text/TextMesh.js");
include("source/core/objects/text/TextBitmap.js");
include("source/core/objects/text/TextSprite.js");

include("source/core/objects/lights/PointLight.js");
include("source/core/objects/lights/SpotLight.js");
include("source/core/objects/lights/AmbientLight.js");
include("source/core/objects/lights/DirectionalLight.js");
include("source/core/objects/lights/HemisphereLight.js");
include("source/core/objects/lights/RectAreaLight.js");

include("source/core/objects/cameras/Viewport.js");
include("source/core/objects/cameras/PerspectiveCamera.js");
include("source/core/objects/cameras/OrthographicCamera.js");
include("source/core/objects/cameras/CubeCamera.js");

include("source/core/objects/audio/AudioEmitter.js");
include("source/core/objects/audio/PositionalAudio.js");

include("source/core/objects/script/Script.js");

include("source/core/objects/physics/PhysicsObject.js");

include("source/core/objects/spine/SpineAnimation.js");
include("source/core/objects/spine/SpineTexture.js");

include("source/core/objects/particle/core/ParticleEmitterControl.js");
include("source/core/objects/particle/core/ParticleGroup.js");
include("source/core/objects/particle/core/ShaderUtils.js");
include("source/core/objects/particle/helpers/ShaderAttribute.js");
include("source/core/objects/particle/helpers/TypedArrayHelper.js");
include("source/core/objects/particle/shaders/ParticleShaderChunks.js");
include("source/core/objects/particle/shaders/ParticleShaders.js");
include("source/core/objects/particle/ParticleEmitter.js");

include("source/core/objects/misc/Sky.js");
include("source/core/objects/misc/Container.js");
include("source/core/objects/misc/LensFlare.js");
include("source/core/objects/misc/BrowserView.js");

include("source/core/objects/animation/Skeleton.js");

include("source/core/objects/controls/OrbitControls.js");
include("source/core/objects/controls/FirstPersonControls.js");

include("source/core/objects/Program.js");
include("source/core/objects/Scene.js");

include("source/core/utils/binary/Base64Utils.js");
include("source/core/utils/binary/ArraybufferUtils.js");
include("source/core/utils/binary/BufferUtils.js");

include("source/core/utils/timer/Timer.js");
include("source/core/utils/timer/AnimationTimer.js");

include("source/core/utils/LocalStorage.js");
include("source/core/utils/EventManager.js");
include("source/core/utils/MathUtils.js");
include("source/core/utils/ObjectUtils.js");
include("source/core/utils/PhysicsGenerator.js");

/**
 * NunuApp is the main class of the runtime system, is used to embed nunu application into a webpage.
 *
 * .isp files can be loaded directly into webpages.
 * 
 * @class NunuApp
 * @module Runtime
 * @constructor
 * @param {Element} canvas Canvas to be used by the runtime, if no canvas is provided a new one is created and added to the document.body, to create a new NunuApp without canvas a null value can be passed.
 */
function NunuApp(canvas)
{
	/**
	 * Nunu Program
	 * @property program
	 * @type {Program}
	 */
	this.program = null;

	/**
	 * Graphics renderer in use by this NunuApp instance
	 * @property renderer
	 * @type {Renderer}
	 */
	this.renderer = null;

	/**
	 * Runtime control, if true the app is running.
	 * 
	 * @property running
	 * @type {boolean}
	 */
	this.running = false;

	/**
	 * Flag used to controll if the canvas element is resized automatically by the nunu app instance.
	 * 
	 * If true the canvas is resized whenether the resize method is called.
	 * 
	 * @property canvasFitWindow
	 * @type {boolean}
	 * @default false if a canvas is provided, else true
	 */
	this.canvasFitWindow = false;

	/**
	 * Canvas used to render graphics.
	 * @property canvas
	 * @type {Element}
	 */
	this.canvas = canvas;

	/**
	 * Event manager used to create and manage events for this app.
	 * 
	 * @property events
	 * @type {EventManager}
	 */
	this.events = new EventManager();

	if(canvas === undefined)
	{
		this.canvas = document.createElement("canvas");
		this.canvas.style.position = "absolute";
		this.canvas.style.left = "0px";
		this.canvas.style.top = "0px";
		this.canvasFitWindow = true;
		document.body.appendChild(this.canvas);
	}
}

/**
 * Load a nunustudio application and attach it to the canvas indicated.
 *
 * This method automatically creates resize events, this single line should be enough to make a nunuStudio app run in a webpage.
 *
 * @static
 * @method loadApp
 * @param {string} url URL for the nsp or isp nunuStudio file.
 * @param {string} canvas Canvas object or canvas id.
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
			app.canvas.width = nunuApps[i].canvas.parentElement.offsetWidth;
			app.canvas.height = nunuApps[i].canvas.parentElement.offsetWidth;
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
	this.renderer = this.program.rendererConfig.createRenderer(this.canvas);

	//Mouse and Keyboard input
	this.keyboard = new Keyboard();
	this.mouse = new Mouse();
	this.mouse.setCanvas(this.canvas);

	//Attach this runtime to program
	this.program.app = this;

	//Create default camera
	this.program.defaultCamera = new PerspectiveCamera(60, 1, 0.1, 1e5);
	this.program.defaultCamera.position.set(0, 5, -5);

	//Set renderer
	this.program.setRenderer(this.renderer);
	this.program.setMouseKeyboard(this.mouse, this.keyboard);
	
	//Initialize program
	this.program.initialize();

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

	this.resize();
	this.resume();
};

/**
 * Load program asynchronously and run it after its loaded.
 * 
 * @method loadRunProgram
 * @param {string} fname Name of the file to load
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
 * @param {string} fname Name of the file to load
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
 * @param {string} fname Name of the file to load
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
				requestAnimationFrame(update);
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
 * @param {Element} canvas Canvas
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
	if(this.canvas !== null && this.program !== null && this.renderer !== null)
	{
		var width = 1;
		var height = 1;

		//Automatically fit window
		if(this.canvasFitWindow)
		{
			this.canvas.style.width = window.innerWidth + "px";
			this.canvas.style.height = window.innerHeight + "px";	
			width = window.innerWidth;
			height = window.innerHeight;
		}
		else
		{
			width = this.canvas.offsetWidth;
			height = this.canvas.offsetHeight;
		}

		//Device pixel ratio
		if(this.program.handlePixelRatio)
		{
			width *= window.devicePixelRatio;
			height *= window.devicePixelRatio;
		}

		//Update size
		this.renderer.setSize(width, height, false);
		this.program.resize(width, height);
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
	return this.program !== null && this.program.vrAvailable();
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
		if(this.program.vrRunning)
		{
			this.program.exitVR();
		}
		else
		{
			this.program.enterVR();
		}
	}
	else
	{
		console.warn("nunuStudio: Loaded program is not VR enabled.");
	}
};

/**
 * Set a element to fullscreen mode, if none is passed the rendering canvas is used.
 *
 * @method toggleFullscreen
 * @param {Element} element DOM element to go fullscren by default the rendering canvas is used
 */
NunuApp.prototype.toggleFullscreen = function(element)
{
	var fullscreen = Nunu.isFullscreen();

	if(element === undefined)
	{
		element = this.canvas;
	}

	Nunu.setFullscreen(!fullscreen, element);
};
