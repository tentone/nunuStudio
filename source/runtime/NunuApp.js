"use strict";

//Nunu global
include("Nunu.js");

//Runtime dependencies
include("lib/three/three.min.js");
include("lib/three/effects/VREffect.js");
include("lib/three/animation/Animation.js");
include("lib/three/animation/AnimationHandler.js");
include("lib/three/animation/KeyFrameAnimation.js");

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

include("core/webvr/VRControls.js");

include("core/resources/Font.js");
include("core/resources/Video.js");
include("core/resources/Audio.js");
include("core/resources/Image.js");

include("core/texture/CanvasTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/Texture.js");

include("core/loaders/FontLoader.js");
include("core/loaders/ImageLoader.js");
include("core/loaders/VideoLoader.js");
include("core/loaders/AudioLoader.js");
include("core/loaders/TextureLoader.js");
include("core/loaders/ObjectLoader.js");
include("core/loaders/TTFLoader.js");

include("core/objects/device/LeapMotion.js");
include("core/objects/device/KinectDevice.js");
include("core/objects/mesh/Mesh.js");
include("core/objects/mesh/SkinnedMesh.js");
include("core/objects/mesh/Text3D.js");
include("core/objects/sprite/Sprite.js");
include("core/objects/sprite/TextSprite.js");
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

		this.canvas_resize = true;
	}
	else
	{
		this.canvas = canvas;
		this.canvas_resize = false;
	}

	//Lock pointer function
	var canvas = this.canvas;
	this.lock_mouse = function()
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

//Load program from file
NunuApp.prototype.loadProgram = function(fname)
{
	var loader = new ObjectLoader();
	var data = FileSystem.readFile(fname);
	this.program = loader.parse(JSON.parse(data));
}

//Load and run program (async)
NunuApp.prototype.loadRunProgram = function(fname, callback)
{
	var loader = new ObjectLoader();
	var app = this;

	FileSystem.readFile(fname, false, function(data)
	{
		app.program = loader.parse(JSON.parse(data));
		app.run();

		if(callback !== undefined)
		{
			callback();
		}
	});
}

//Start nunu program
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
	Keyboard.initialize();
	Mouse.initialize();
	Mouse.setCanvas(this.canvas);

	//Attach this runtime to program
	this.program.app = this;

	//Create default camera
	this.program.default_camera = new PerspectiveCamera(60, this.canvas.width/this.canvas.height, 0.1, 1000000);
	this.program.default_camera.position.set(0, 5, -5);

	//Set renderer
	this.program.setRenderer(this.renderer);
	
	//Initialize program
	this.program.initialize();
	this.program.resize(this.canvas.width, this.canvas.height);

	//Lock mouse pointer
	if(this.program.lock_pointer)
	{
		this.canvas.addEventListener("click", this.lock_mouse, false);
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

//Update nunu program
NunuApp.prototype.update = function()
{
	Mouse.update();
	Keyboard.update();

	this.program.update();
	this.program.render(this.renderer);
}

//Exit from app
NunuApp.prototype.exit = function()
{
	//Remove mouse lock event from canvas
	if(this.program.lock_pointer)
	{
		this.canvas.removeEventListener("click", this.lock_mouse, false);
	}

	//Dispose and remove program
	if(this.program !== null)
	{
		this.program.dispose();
		this.program = null;
	}

	//Dispose keyboard and mouse
	Mouse.dispose();
	Keyboard.dispose();

	//Run onExit callback if any
	if(this.onExit !== undefined)
	{
		this.onExit();
	}

	//If running on nwjs close all windows
	var gui = require("nw.gui");
	if(gui !== undefined)
	{
		gui.App.closeAllWindows();
		gui.App.quit();
	}
}

//Resize to fit window
NunuApp.prototype.resize = function()
{
	if(this.canvas !== null && this.canvas_resize)
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

//Set on data receive callback (callback receives data as argument)
NunuApp.prototype.setOnDataReceived = function(callback)
{
	this.onDataReceived = callback;
}

//Set on exit callback
NunuApp.prototype.setOnExit = function(callback)
{
	this.onExit = callback;
}

//Check if VR is available
NunuApp.prototype.vrAvailable = function()
{
	return this.program.vr && Nunu.webvrAvailable();	
}

//Toggle vr
NunuApp.prototype.toggleVR = function()
{
	if(this.program.vr)
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

//Set fullscreen mode
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
			element = document.body;
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
