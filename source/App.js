"use strict";

//External libs
include("lib/three/three.min.js");
include("lib/three/effects/VREffect.js");
include("lib/cannon.min.js");
include("lib/leap.min.js");
include("lib/stats.min.js");
include("lib/SPE.min.js");
include("lib/spine.min.js");

//Internal modules
include("core/three/Three.js");
include("core/three/Object3D.js");
include("core/three/Vector3.js");
include("core/three/Vector2.js");
include("core/three/Color.js");
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

include("core/texture/TextTexture.js");
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
include("core/objects/lights/PointLight.js");
include("core/objects/lights/SpotLight.js");
include("core/objects/lights/AmbientLight.js");
include("core/objects/lights/DirectionalLight.js");
include("core/objects/lights/HemisphereLight.js");
include("core/objects/lights/Sky.js");
include("core/objects/cameras/PerspectiveCamera.js");
include("core/objects/cameras/OrthographicCamera.js");
include("core/objects/audio/AudioEmitter.js");
include("core/objects/script/Script.js");
include("core/objects/script/BlockScript.js");
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
include("core/utils/Mesh2shape.js");

include("core/FileSystem.js");

//App class
function App(){}

//NWJS modules
try
{
	App.fs = require("fs");
	App.gui = require("nw.gui");
	App.clipboard = App.gui.Clipboard.get();
	App.args = App.gui.App.argv;
}
catch(e)
{
	App.args = [];
}

//App initialization
App.initialize = function(main)
{
	App.fullscreen = false;

	Keyboard.initialize();
	Mouse.initialize();

	//Create main program
	App.main = main;
	App.main.initialize();

	//Time control
	App.delta = 0;
	App.time = Date.now();

	//Start Loop
	App.loop();
}

//App loop
App.loop = function()
{
	requestAnimationFrame(App.loop);

	//Update input
	Mouse.update();
	Keyboard.update();
	
	//Update time values
	App.delta = Date.now() - App.time;
	App.time += App.delta;

	//Update and render
	App.main.update();
	App.main.render();
}

//Resize app
App.resize = function()
{
	App.main.resize();
}

//Set fullscreen mode
App.setFullscreen = function(fullscreen, element)
{
	App.fullscreen = fullscreen;

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

//Load Main program
App.loadMain = function(main)
{
	App.main = main;
	App.main.initialize(App.canvas);
}

//Check if webvr is available
App.webvrAvailable = function()
{
	return (navigator.getVRDisplays !== undefined);
}

//Set on exit callback
App.setOnExit = function(callback)
{
	App.onExit = callback;
} 

//Exit from app
App.exit = function()
{
	if(App.onExit !== undefined)
	{
		App.onExit();
	}

	if(App.gui !== undefined)
	{
		App.gui.App.closeAllWindows();
		App.gui.App.quit();
	}
}

//Include javacript or css file in project
function include(file, onload)
{
	if(file.endsWith(".js"))
	{
		var js = document.createElement("script");
		js.src = file;
		js.type = "text/javascript";
		js.async = false;
		if(onload)
		{
			js.onload = onload;
		}
		document.body.appendChild(js);
	}
	else if(file.endsWith(".css"))
	{
		var css = document.createElement("link");
		css.href = file;
		css.rel = "stylesheet";
		document.body.appendChild(css);
	}
	else if(file.endsWith("*"))
	{
		if(App.fs !== undefined)
		{
			var directory = file.replace("*", "");
			var files = App.fs.readdirSync(directory);
			for(var i = 0; i < files.length; i++)
			{
				include(directory + files[i]);
			}
		}
	}
	else
	{
		if(App.fs !== undefined)
		{
			var directory = file + "/";
			try
			{
				var files = App.fs.readdirSync(directory);
				for(var i = 0; i < files.length; i++)
				{
					include(directory + files[i]);
				}
			}
			catch(e){}
		}
	}
}
