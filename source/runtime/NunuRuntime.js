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
include("core/objects/Bone.js");
include("core/objects/Container.js");
include("core/objects/ParticleEmitter.js");
include("core/objects/Program.js");
include("core/objects/Scene.js");

include("core/utils/Base64Utils.js");
include("core/utils/ArraybufferUtils.js");
include("core/utils/MathUtils.js");
include("core/utils/ObjectUtils.js");
include("core/utils/BufferUtils.js");

//Nunu app contructor
function NunuRuntime(canvas)
{
	//Program
	this.program = null;

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

	//WebGL renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true});
	this.renderer.autoClear = false;
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFShadowMap;
	this.renderer.setSize(this.canvas.width, this.canvas.height);
}

//Fullscreen control
NunuRuntime.fullscreen = false;

//Load program from file
NunuRuntime.prototype.loadProgram = function(fname)
{
	var loader = new ObjectLoader();
	var data = JSON.parse(FileSystem.readFile(fname));
	this.program = loader.parse(data);
}

//Start nunu program
NunuRuntime.prototype.run = function()
{
	if(this.program === null)
	{
		console.warn("nunuStudio: no program is loaded [app.loadPogram(fname)]");
		return;
	}

	//Mouse and Keyboard input
	Keyboard.initialize();
	Mouse.initialize();
	Mouse.setCanvas(this.canvas);

	//Virtual reality
	if(this.program.vr === true)
	{
		this.vr_controls = new VRControls();
		this.vr_effect = new THREE.VREffect(this.renderer);
	}

	//Create default camera
	this.program.default_camera = new PerspectiveCamera(60, this.canvas.width/this.canvas.height, 0.1, 1000000);
	this.program.default_camera.position.set(0, 5, -5);
	this.program.renderer = this.renderer;
	
	//Initialize program
	this.program.initialize();
	this.program.resize(this.canvas.width, this.canvas.height);

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
NunuRuntime.prototype.update = function()
{
	Mouse.update();
	Keyboard.update();

	this.program.update();
	this.program.render(this.renderer);
}

//Exit from app
NunuRuntime.prototype.exit = function()
{
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
	if(NunuRuntime.gui !== undefined)
	{
		NunuRuntime.gui.App.closeAllWindows();
		NunuRuntime.gui.App.quit();
	}
}

//Resize to fit window
NunuRuntime.prototype.resize = function()
{
	if(this.canvas !== null && this.canvas_resize)
	{
		this.canvas.style.width = window.innerWidth + "px";
		this.canvas.style.height = window.innerHeight + "px";
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}
	
	if(this.program !== null && this.renderer !== undefined)
	{
		this.renderer.setSize(this.canvas.width, this.canvas.height);
		this.program.resize(this.canvas.width, this.canvas.height);
	}
}

//Set on exit callback
NunuRuntime.prototype.setOnExit = function(callback)
{
	this.onExit = callback;
}

//Set fullscreen mode
NunuRuntime.setFullscreen = function(fullscreen, element)
{
	NunuRuntime.fullscreen = fullscreen;

	if(fullscreen)
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

//Check if webvr is available
NunuRuntime.webvrAvailable = function()
{
	return (navigator.getVRDisplays !== undefined);
}
