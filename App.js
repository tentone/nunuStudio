"use strict";

//External libs
include("lib/three/three.min.js");
include("lib/three/effects/VREffect.js");

include("lib/leap/leap-0.6.4.min.js");
include("lib/cannon/cannon.min.js");
include("lib/stats.min.js");
include("lib/SPE.min.js");

//WebVR polyfill
if(navigator.getVRDisplays === undefined)
{
	include("lib/webvr-polyfill.js", function()
	{
		window.WebVRConfig =
		{
			CARDBOARD_UI_DISABLED: false,
			FORCE_ENABLE_VR: false, //Forces availability of VR mode in desktop
			K_FILTER: 1.0, //0 for accelerometer, 1 for gyro
			ROTATE_INSTRUCTIONS_DISABLED: true,
			PREDICTION_TIME_S: 0.01, //Time predict during fast motion
			TOUCH_PANNER_DISABLED: true,
			YAW_ONLY: false,
			MOUSE_KEYBOARD_CONTROLS_DISABLED: true,
			DEFER_INITIALIZATION: false,
			ENABLE_DEPRECATED_API: true,
			BUFFER_SCALE: 0.5,
			DIRTY_SUBMIT_FRAME_BINDINGS: false
		}
	});
}

//Internal modules
include("input/Key.js");
include("input/Keyboard.js");
include("input/Mouse.js");

include("core/ObjectLoader.js");
include("core/Program.js");
include("core/Scene.js");
include("core/ObjectUtils.js");

include("core/three/Object3D.js");
include("core/three/Vector3.js");
include("core/three/Vector2.js");
include("core/three/Color.js");
include("core/three/Three.js");

include("core/webvr/VRControls.js");

include("core/texture/TextTexture.js");
include("core/texture/VideoTexture.js");
include("core/texture/WebcamTexture.js");
include("core/texture/Texture.js");

include("core/loaders/FontLoader.js");

include("core/objects/physics/PhysicsObject.js");
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
include("core/objects/audio/Audio.js");
include("core/objects/script/Script.js");
include("core/objects/script/BlockScript.js");
include("core/objects/Bone.js");
include("core/objects/Container.js");
include("core/objects/Model3D.js");
include("core/objects/AnimatedModel.js");
include("core/objects/Text3D.js");
include("core/objects/Sprite.js");
include("core/objects/ParticleEmitter.js");

//App class
function App(){}

//Require NodeJS modules
try
{
	App.fs = require("fs");
	App.gui = require("nw.gui");
	App.clipboard = App.gui.Clipboard.get();
}
catch(e){}

//App initialization
App.initialize = function(main)
{
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

//Open file chooser dialog receives callback function, file filter, savemode and is its directory only
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
		file.overrideMimeType("text/plain");
		var data = null;

		//Request file to server
		file.open("GET", fname, false);

		//Get file
		file.onreadystatechange = function ()
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
		}

		//Send null to ensure that file was received
		if(sync)
		{
			file.send(null);
		}

		return data;
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

//Copy file (can't be used to copy folders)
App.copyFile = function(src, dest)
{
	if(App.fs !== undefined)
	{
		App.fs.createReadStream(src).pipe(App.fs.createWriteStream(dest));
	}
}

//Make a directory (dont trow exeption if directory already exists)
App.makeDirectory = function(dir)
{
	if(App.fs !== undefined)
	{
		try
		{
			App.fs.mkdirSync(dir);
		}
		catch(e){}
	}
}

//Returns files in directory (returns empty array in case of error)
App.getFilesDirectory = function(dir)
{
	if(App.fs !== undefined)
	{
		try
		{
			return App.fs.readdirSync(dir);
		}
		catch(e)
		{
			return [];
		}
	}
	return [];
}

//Copy folder and all its files (includes symbolic links)
App.copyFolder = function(src, dest)
{
	if(App.fs !== undefined)
	{
		App.makeDirectory(dest);
		var files = App.fs.readdirSync(src);

		for(var i = 0; i < files.length; i++)
		{
			var source = src + "\\" + files[i];
			var destiny = dest + "\\" + files[i];
			var current = App.fs.statSync(source);
			
			//Directory
			if(current.isDirectory())
			{
				App.copyFolder(source, destiny);
			}
			//Symbolic link
			else if(current.isSymbolicLink())
			{
				App.fs.symlinkSync(App.fs.readlinkSync(source), destiny);
			}
			//File
			else
			{
				App.copyFile(source, destiny);
			}
			
		}
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
		var directory = file.replace("*", "");
		var files = App.getFilesDirectory(directory);
		for(var i = 0; i < files.length; i++)
		{
			include(directory + files[i]);
		}
	}
	else
	{
		var directory = file + "/";
		try
		{
			var files = App.getFilesDirectory(directory);
			for(var i = 0; i < files.length; i++)
			{
				include(directory + files[i]);
			}
		}
		catch(e){}
	}
}