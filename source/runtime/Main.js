"use strict";

function Main(){}

//App to load
Main.app = "app.isp";

//Initialize Main
Main.initialize = function()
{
	//Main program and scene
	Main.program = Main.loadProgram(Main.app);

	//Renderer and canvas
	Main.canvas = document.createElement("canvas");
	Main.canvas.style.position = "absolute";
	Main.canvas.style.left = "0px";
	Main.canvas.style.top = "0px";
	Main.canvas.style.width = window.innerWidth + "px";
	Main.canvas.style.height = window.innerHeight + "px";
	Main.canvas.width = window.innerWidth;
	Main.canvas.height = window.innerHeight;
	document.body.appendChild(Main.canvas);

	//Stats tool
	Main.stats = new Stats();
	Main.stats.dom.style.position = "absolute";
	Main.stats.dom.style.zIndex = "1000";
	Main.stats.dom.style.opacity = "0.8";
	Main.stats.dom.style.pointerEvents = "none";
	//document.body.appendChild(Main.stats.dom);

	//VR Stuff
	Main.vr_controls = null;
	Main.vr_effect = null;

	//Define mouse canvas
	Mouse.setCanvas(Main.canvas);

	//Set renderer
	Main.renderer = new THREE.WebGLRenderer({canvas: Main.canvas, antialias: true});
	Main.renderer.autoClear = false;
	Main.renderer.shadowMap.enabled = true;
	Main.renderer.shadowMap.type = THREE.PCFShadowMap;
	Main.renderer.setPixelRatio(window.devicePixelRatio || 1.0);
	Main.renderer.setSize(Main.canvas.width, Main.canvas.height);

	//Initialize program
	Main.program.default_camera = new PerspectiveCamera(60, Main.canvas.width/Main.canvas.height, 0.1, 1000000);
	Main.program.default_camera.position.set(0, 5, -5);
	Main.program.renderer = Main.renderer;
	Main.program.initialize();
	Main.program.resize(Main.canvas.width, Main.canvas.height);

	//Fullscreen button
	Main.fullscreen = document.createElement("div");
	Main.fullscreen.style.position = "absolute";
	Main.fullscreen.style.left = (window.innerWidth - 30) + "px";
	Main.fullscreen.style.top = (window.innerHeight - 30) + "px";
	document.body.appendChild(Main.fullscreen);
	
	var fullscreen = true;
	Main.fullscreen.onclick = function()
	{
		if(fullscreen)
		{
			App.enterFullscreen();
			Main.resize();
		}
		else
		{
			App.leaveFullscreen();
			Main.resize();
		}
		fullscreen = !fullscreen;
	};

	var img = document.createElement("img");
	img.style.position = "absolute";
	img.style.cursor = "pointer";
	img.width = 25;
	img.height = 25;
	img.src = "fullscreen.png";
	img.onmouseenter = function()
	{
		img.style.opacity = 0.5;
	}
	img.onmouseleave = function()
	{
		img.style.opacity = 1.0;
	}
	Main.fullscreen.appendChild(img);

	//VR button
	if(Main.program.vr && App.webvrAvailable())
	{
		Main.vr = document.createElement("div");
		Main.vr.style.position = "absolute";
		Main.vr.style.left = (window.innerWidth - 60) + "px";
		Main.vr.style.top = (window.innerHeight - 30) + "px";
		document.body.appendChild(Main.vr);

		var vr_state = true;
		Main.vr.onclick = function()
		{
			if(Main.vr_effect !== null)
			{
				Main.vr_effect.setFullScreen(vr_state);
				vr_state = !vr_state;
			}
		};

		var img = document.createElement("img");
		img.style.position = "absolute";
		img.style.cursor = "pointer";
		img.width = 25;
		img.height = 25;
		img.src = "vr.png";
		
		img.onmouseenter = function()
		{
			img.style.opacity = 0.5;
		}
		img.onmouseleave = function()
		{
			img.style.opacity = 1.0;
		}
		Main.vr.appendChild(img);

		//Create vr effect
		Main.vr_controls = new VRControls();
		Main.vr_effect = new THREE.VREffect(Main.renderer);
	}

	//Set pointer lock
	if(Main.program.lock_pointer)
	{
		Mouse.setLock(true);
	}
}

//Update program
Main.update = function()
{
	Main.stats.begin();
	Main.program.update();
}

//Render program
Main.render = function()
{
	Main.program.render(Main.renderer);
	Main.stats.end();
}

//Resize to fit window
Main.resize = function()
{
	//Update canvas and renderer size
	if(Main.canvas !== null && Main.renderer != null)
	{
		Main.canvas.style.width = window.innerWidth + "px";
		Main.canvas.style.height = window.innerHeight + "px";
		Main.canvas.width = window.innerWidth;
		Main.canvas.height = window.innerHeight;
		Main.renderer.setSize(Main.canvas.width, Main.canvas.height);
		Main.program.resize(Main.canvas.width, Main.canvas.height);
	}

	//Fullscreen button
	Main.fullscreen.style.left = (window.innerWidth - 30) + "px";
	Main.fullscreen.style.top = (window.innerHeight - 30) + "px";

	//VR button
	if(Main.vr !== undefined)
	{
		Main.vr.style.left = (window.innerWidth - 60) + "px";
		Main.vr.style.top = (window.innerHeight - 30) + "px";
	}
}

//Load program from file
Main.loadProgram = function(fname)
{
	var loader = new ObjectLoader();
	var data = JSON.parse(FileSystem.readFile(fname));
	return loader.parse(data);
}

//Exit program
Main.exit = function()
{
	process.exit();
}
