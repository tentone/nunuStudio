include("lib/three/three.js");
include("lib/three/loaders/OBJLoader.js");
include("lib/three/loaders/MTLLoader.js");
include("lib/three/loaders/VRMLLoader.js");
include("lib/three/loaders/FBXLoader.js");
include("lib/three/loaders/ColladaLoader.js");
include("lib/three/loaders/collada/Animation.js");
include("lib/three/loaders/collada/AnimationHandler.js");
include("lib/three/loaders/collada/KeyFrameAnimation.js");

include("lib/three/cameras/CinematicCamera.js");

include("lib/three/vr/VRControls.js");
include("lib/three/vr/VREffect.js");
include("lib/three/vr/webvr-manager.js");
include("lib/three/vr/webvr-polyfill.js");

include("lib/leap/leap-0.6.4.min.js");

include("lib/cannon/cannon.min.js");
include("lib/cannon/cannondebugrenderer.js");

include("lib/stats.min.js");
include("lib/opentype.min.js");
include("lib/jszip.min.js");
include("lib/SPE.min.js");

include("input/Key.js");
include("input/Keyboard.js");
include("input/Mouse.js");

include("core/ThreeExpand.js");
include("core/ObjectLoader.js");
include("core/Program.js");
include("core/ObjectUtils.js");
include("core/Global.js");

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
include("core/objects/Scene.js");
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

	//Stats tool
	App.stats = new Stats();
	App.stats.setMode(0);
	App.stats.domElement.style.position = "absolute";
	App.stats.domElement.style.left = "0px";
	App.stats.domElement.style.top = "0px";
	App.stats.domElement.style.zIndex = "100";
	App.stats.domElement.style.opacity = "0.7";
	App.stats.domElement.style.pointerEvents = "none";
	document.body.appendChild(App.stats.domElement);

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
	chooser.style.display = "none";
	if(filter !== undefined)
	{
		chooser.accept = filter;
	}
	
	if(savemode === true)
	{
		chooser.nwsaveas = "file";
	}

	document.body.appendChild(chooser);

	//Create onchange event and trigger it
	chooser.onchange = function(event)
	{
		if(callback !== undefined)
		{
			callback(event);
		}
	};

	chooser.click();  
}

//Read File
App.readFile = function(fname)
{
	if(App.fs !== undefined)
	{
		return App.fs.readFileSync(fname, "utf8");
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
				}
				ready = true;
			}
		}

		//Send null to ensure that file was received
		file.send(null);

		return data;
	}
}

//Write File
App.writeFile = function(fname, data)
{
	if(App.fs !== undefined)
	{
		App.fs.writeFile(fname, data, "utf8");
	}
}

//Load Main program
App.loadMain = function(main)
{
	App.main = main;
	App.main.initialize(App.canvas);
}

//Show Stats
App.showStats = function(value)
{
	if(value === true)
	{
		App.stats.domElement.style.visibility = "visible";
	}
	else
	{
		App.stats.domElement.style.visibility = "hidden";
	}
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
	//setTimeout(App.loop, 0);
	requestAnimationFrame(App.loop);

	App.stats.begin();

	//Update Mouse Values
	Mouse.update();
	Keyboard.update();
	
	//Update time values
	App.delta_time = Date.now() - App.time;
	App.time += App.delta_time;

	//Update and draw
	App.main.update();
	App.main.draw();

	App.stats.end();
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
		document.write('<script type="text/javascript" src="'+ file + '"></script>');
	}
	else if(file.endsWith(".css"))
	{
		document.write('<link rel="stylesheet" href="' + file + '">');
	}	
}
