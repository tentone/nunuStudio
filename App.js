include("lib/three/three.min.js");
include("lib/three/stats.min.js");
include("lib/three/loaders/OBJLoader.js");
include("lib/three/loaders/MTLLoader.js");
include("lib/three/loaders/OBJMTLLoader.js");
include("lib/three/loaders/ColladaLoader.js");
include("lib/three/loaders/collada/Animation.js");
include("lib/three/loaders/collada/AnimationHandler.js");
include("lib/three/loaders/collada/KeyFrameAnimation.js");

include("lib/leap/leap-0.6.4.min.js");
include("lib/leap/leap-plugins-0.1.11.min.js");

include("lib/cannon/cannon.min.js");
include("lib/cannon/ConvexGeometry.js");
include("lib/cannon/CannonDebugRenderer.js");

include("device/LeapDevice.js");
include("device/KinectDevice.js");

include("input/Key.js");
include("input/Keyboard.js");
include("input/Mouse.js");

include("core/animation/Joint.js");
include("core/animation/Skeleton.js");
include("core/Program.js");
include("core/Scene.js");
include("core/Script.js");

include("core/objects/BaseObject.js");

//App class
function App(){}

//App initialization
App.initialize = function(main)
{
	//Stats tool
	App.stats = new Stats();
	App.stats.setMode(0);
	App.stats.domElement.style.position = "absolute";
	App.stats.domElement.style.left = "0px";
	App.stats.domElement.style.top = "0px";
	document.body.appendChild(App.stats.domElement);
	
	//Auxiliar values
	App.pid2 = Math.PI/2;

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
	App.main.resize();
}

//Auxiliar include
function include(jsFile)
{
	document.write('<script type="text/javascript" src="'+ jsFile + '"></script>');
}
