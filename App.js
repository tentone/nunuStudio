//External libs
include("lib/three/three.js");
include("lib/three/loaders/OBJLoader.js");
include("lib/three/loaders/MTLLoader.js");
include("lib/three/loaders/VRMLLoader.js");
include("lib/three/loaders/FBXLoader.js");
include("lib/three/loaders/ColladaLoader.js");
include("lib/three/loaders/collada/Animation.js");
include("lib/three/loaders/collada/AnimationHandler.js");
include("lib/three/loaders/collada/KeyFrameAnimation.js");
include("lib/three/webvr/VREffect.js");

include("lib/leap/leap-0.6.4.min.js");

include("lib/cannon/cannon.min.js");
include("lib/cannon/cannondebugrenderer.js");

include("lib/stats.min.js");
include("lib/opentype.min.js");
include("lib/jszip.min.js");
include("lib/SPE.min.js");

//Internal modules
include("input/Key.js");
include("input/Keyboard.js");
include("input/Mouse.js");

include("core/MathUtils.js");
include("core/ThreeExpand.js");
include("core/ObjectLoader.js");
include("core/Program.js");
include("core/Scene.js");
include("core/ObjectUtils.js");

include("core/webvr/VRControls.js");

include("core/texture/TextTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/Texture.js");

include("core/loaders/FontLoader.js");

include("core/objects/device/LeapHand.js");
include("core/objects/device/KinectDevice.js");
include("core/objects/lights/PointLight.js");
include("core/objects/lights/SpotLight.js");
include("core/objects/lights/AmbientLight.js");
include("core/objects/lights/DirectionalLight.js");
include("core/objects/lights/HemisphereLight.js");
include("core/objects/lights/Sky.js");
include("core/objects/cameras/PerspectiveCamera.js");
include("core/objects/cameras/OrthographicCamera.js");

include("core/objects/Bone.js");
include("core/objects/Container.js");
include("core/objects/Script.js");
include("core/objects/Model3D.js");
include("core/objects/AnimatedModel.js");
include("core/objects/Text3D.js");
include("core/objects/Sprite.js");
include("core/objects/ParticleEmitter.js");
include("core/objects/Audio.js");

//App class
function App(){}

//App initialization
App.initialize = function(main)
{
	//Node modules
	try
	{
		App.fs = require("fs");
		App.gui = require("nw.gui");
		App.clipboard = App.gui.Clipboard.get();
	}
	catch(e){}

	//Fullscreen flag
	App.fullscreen = false;

	//Init Input
	Keyboard.initialize();
	Mouse.initialize();

	//Create main program
	App.main = main;
	App.main.initialize(App.canvas);

	//Time control
	App.delta_time = 0;
	App.time = Date.now();

	//Start Loop
	App.loop();
}

//File chooser callback receives event object
App.chooseFile = function(callback, filter, savemode)
{
	//Create file chooser element
	var chooser = document.createElement("input");
	chooser.type = "file";
	
	if(filter !== undefined)
	{
		chooser.accept = filter;
	}
	
	if(savemode === true)
	{
		chooser.nwsaveas = "file";
	}

	//Create onchange event
	chooser.onchange = function(event)
	{
		if(callback !== undefined)
		{
			callback(chooser.value);
		}
	};

	//Force trigger onchange event
	chooser.click(); 
}

//Read File
App.readFile = function(fname, sync, callback)
{
	//If sync undefined set true
	if(sync === undefined)
	{
		sync = true;
	}

	//Check if node available
	if(App.fs !== undefined)
	{
		//If sync
		if(sync)
		{
			return App.fs.readFileSync(fname, "utf8");
		}
		else
		{
			App.fs.readFile(fname, "utf8", callback);
			return null;
		}
	}
	else
	{
		var file = new XMLHttpRequest();
		var ready = false;
		var data = null;

		//Request file to server
		file.open("GET", fname, false);

		//Get file
		file.onreadystatechange = function ()
		{
			if(file.readyState === 4)
			{
				if(file.status === 200 || file.status === 0)
				{
					data = file.responseText;

					//Callback
					if(callback !== undefined)
					{
						callback(file.responseText);
					}
				}
				ready = true;
			}
		}

		//Send null to ensure that file was received
		if(sync)
		{
			file.send(null);
		}

		return data;
	}
}

//Leave fullscreen mode
App.leaveFullscreen = function()
{
	//Set fullscreen flag
	App.fullscreen = false;

	if(document.exitFullscreen)
	{
		document.exitFullscreen();
	}
	else if(document.mozCancelFullScreen)
	{
		document.mozCancelFullScreen();
	}
	else if(document.webkitExitFullscreen)
	{
		document.webkitExitFullscreen();
	}
}

//Set an element to fullscreen mode
App.enterFullscreen = function(element)
{
	//If no element passed use full page
	if(element === undefined)
	{
		element = document.body;
	}

	//Set fullscreen flag
	App.fullscreen = true;

	//Set element to fullscreen
	if(element.requestFullscreen)
	{
		element.requestFullscreen();
	}
	else if(element.mozRequestFullScreen)
	{
		element.mozRequestFullScreen();
	}
	else if(element.webkitRequestFullscreen)
	{
		element.webkitRequestFullscreen();
	}
	else if(element.msRequestFullscreen)
	{
		element.msRequestFullscreen();
	}
}

//Write File
App.writeFile = function(fname, data)
{
	if(App.fs !== undefined)
	{
		var stream = App.fs.createWriteStream(fname, "utf8");
		stream.write(data);
		stream.end();
	}
}

//Load Main program
App.loadMain = function(main)
{
	App.main = main;
	App.main.initialize(App.canvas);
}

//Check if webVr is available
App.webvrAvailable = function()
{
	return (navigator.getVRDisplays !== undefined);
}

//Set if mouse locked
App.setMouseLock = function(value)
{
	if(value === true)
	{
		document.body.onclick = function()
		{
			try
			{
				document.body.requestPointerLock = canvas.mozRequestPointerLock || canvas.requestPointerLock || canvas.webkitRequestPointerLock;
				document.body.requestPointerLock();
			}
			catch(e){}
		}
	}
	else
	{
		document.body.onclick = function(){}
	}
}

//App loop
App.loop = function()
{
	//Call loop again
	requestAnimationFrame(App.loop);

	//Update Mouse Values
	Mouse.update();
	Keyboard.update();
	
	//Update time values
	App.delta_time = Date.now() - App.time;
	App.time += App.delta_time;

	//Update and draw
	App.main.update();
	App.main.draw();
}

//Called every time page is resized
App.resize = function()
{
	App.main.resize();
}

//Auxiliar include
function include(file)
{
	if(file.endsWith(".js"))
	{
		var js = document.createElement("script");
		js.src = file;
		js.type = "text/javascript";
		js.async = false;
		document.body.appendChild(js);
	}
	else if(file.endsWith(".css"))
	{
		var css = document.createElement("link");
		css.href = file;
		css.rel = "stylesheet";
		document.body.appendChild(css);
	}	
}
