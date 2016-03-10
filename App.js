include("lib/three/three.js");
include("lib/three/loaders/OBJLoader.js");
include("lib/three/loaders/MTLLoader.js");
include("lib/three/loaders/OBJMTLLoader.js");
include("lib/three/loaders/FBXLoader.js");
include("lib/three/loaders/ColladaLoader.js");
include("lib/three/loaders/collada/Animation.js");
include("lib/three/loaders/collada/AnimationHandler.js");
include("lib/three/loaders/collada/KeyFrameAnimation.js");

include("lib/three/vr/es6-promise.js");
include("lib/three/vr/VRControls.js");
include("lib/three/vr/VREffect.js");
include("lib/three/vr/webvr-manager.js");
include("lib/three/vr/webvr-polyfill.js");

include("lib/leap-0.6.4.js");

include("lib/cannon/cannon.js");
include("lib/cannon/ConvexGeometry.js");
include("lib/cannon/CannonDebugRenderer.js");

include("lib/stats.min.js");

include("device/LeapDevice.js");

include("input/Key.js");
include("input/Keyboard.js");
include("input/Mouse.js");

include("core/Program.js");
include("core/Screen.js");

//App class
function App(){}

//App variables
App.stats = null;
App.canvas = null;
App.main = null;
App.delta_time = 0;
App.time = 0;

//App initialization (entry point)
App.initialize = function(main)
{
	//Stas tool
	App.stats = new Stats();
	App.stats.setMode(0);
	App.stats.domElement.style.position = "absolute";
	App.stats.domElement.style.left = "0px";
	App.stats.domElement.style.top = "0px";
	document.body.appendChild(App.stats.domElement);

	//Get canvas
	App.canvas = document.getElementById("canvas");

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

//Load Main program
App.loadMain = function(main)
{
	App.main = main;
	App.main.initialize(App.canvas);
}

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
		App.canvas.onclick = function()
		{
			try
			{
				App.canvas.requestPointerLock = canvas.mozRequestPointerLock || canvas.requestPointerLock || canvas.webkitRequestPointerLock;
				App.canvas.requestPointerLock();
			}
			catch(e){}
		}
	}
	else
	{
		App.canvas.onclick = function(){}
	}
}

//App loop
App.loop = function()
{
	//Prepare next frame render
	requestAnimationFrame(App.loop);

	App.stats.begin();

	//Update Mouse Values
	Mouse.update();
	
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
	App.canvas = document.getElementById("canvas");
	App.main.resize(App.canvas);
}

//Auxiliar include
function include(jsFile)
{
	document.write('<script type="text/javascript" src="'+ jsFile + '"></script>');
}
