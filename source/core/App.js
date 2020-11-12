import {StaticPair} from "@as-com/pson";
import {Component} from "../editor/components/Component.js";
import {EventManager} from "./utils/EventManager.js";
import {Program} from "./objects/Program.js";
import {PerspectiveCamera} from "./objects/cameras/PerspectiveCamera.js";
import {Nunu} from "./Nunu.js";
import {ObjectLoader} from "./loaders/ObjectLoader.js";
import {FileSystem} from "./FileSystem.js";

/**
 * app is the main class of the runtime system, is used to embed projects into external webpages and applications.
 *
 * Project files can be loaded directly from their project files into any kind of project. The app class handles all the runtime and control of the application lifecycle.
 *
 * @class App
 * @module Runtime
 * @constructor
 * @param {Component} canvas Canvas to be used by the runtime, if no canvas is provided a new one is created and added to the document.body, to create a new App without canvas a null value can be passed.
 */
function App(canvas)
{
	/**
	 * Program
	 *
	 * @property program
	 * @type {Program}
	 */
	this.program = null;

	/**
	 * Graphics renderer in use by this app instance
	 *
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
	 * Flag used to control if the canvas element is resized automatically by the app instance.
	 *
	 * If true the canvas is resized whether the resize method is called.
	 *
	 * @property canvasFitWindow
	 * @type {boolean}
	 * @default false if a canvas is provided, else true
	 */
	this.canvasFitWindow = false;

	/**
	 * Canvas used to render graphics.
	 *
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

	if (canvas === undefined)
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
 * Load a application and attach it to the canvas indicated.
 *
 * This method automatically creates resize events, this single line should be enough to make a app run in a webpage.
 *
 * @static
 * @method loadApp
 * @param {string} url URL for the nsp or isp file.
 * @param {string} canvas Canvas object or canvas id.
 */
App.loadApp = function(url, canvas)
{
	if (typeof canvas === "string")
	{
		canvas = document.getElementById(canvas);
	}

	var app = new App(canvas);
	app.loadRunProgram(url);

	window.addEventListener("resize", function()
	{
		if (Nunu.isFullscreen())
		{
			app.canvas.width = window.innerWidth;
			app.canvas.height = window.innerHeight;
		}
		else if (app.canvas.parentElement)
		{
			app.canvas.width = app.canvas.parentElement.offsetWidth;
			app.canvas.height = app.canvas.parentElement.offsetHeight;
		}
		app.resize();
	});
};

/**
 * Start running program.
 *
 * Creates renderer, mouse and keyboard objects, and starts running the loaded application.
 *
 * A program must be loaded before calling this method.
 *
 * @method run
 */
App.prototype.run = function()
{
	if (this.program === null)
	{
		console.warn("nunuStudio: no program is loaded [app.loadPogram(fname)]");
		return;
	}

	// WebGL renderer
	this.renderer = this.program.rendererConfig.createRenderer(this.canvas);

	// Attach this runtime to program
	this.program.app = this;

	// Create default camera
	this.program.defaultCamera = new PerspectiveCamera(60, 1, 0.1, 1e5);
	this.program.defaultCamera.position.set(0, 5, -5);

	// Set renderer
	this.program.setRenderer(this.renderer);

	// Initialize program
	this.program.initialize();

	// Lock mouse pointer
	if (this.program.lockPointer)
	{
		var canvas = this.canvas;
		var mouse = this.mouse;

		this.events.add(canvas, "click", function()
		{
			mouse.setLock(true);
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
 * @param {Function} onProgress onProgress callback, receives progress (percentage) and the xhr onprogress event as parameters.
 */
App.prototype.loadRunProgram = function(fname, onLoad, onProgress)
{
	this.loadProgramAsync(fname, function(app)
	{
		app.run();

		if (onLoad !== undefined)
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
App.prototype.loadProgram = function(fname)
{
	// JSON project
	if (fname.endsWith(".isp"))
	{
		var loader = new ObjectLoader();
		var data = FileSystem.readFile(fname);
		this.program = loader.parse(JSON.parse(data));
	}
	// Binary project
	else if (fname.endsWith(".nsp"))
	{
		var loader = new ObjectLoader();
		var data = FileSystem.readFileArrayBuffer(fname);
		var pson = new StaticPair();
	}
	this.program = loader.parse(pson.decode(data));
};

/**
 * Load program from file, asynchronously.
 *
 * @method loadProgramAsync
 * @param {string} fname Name of the file to load
 * @param {Function} onLoad onLoad callback. Receives as argument the loaded application.
 * @param {Function} onProgress onProgress callback, receives progress (percentage) and the xhr onprogress event as parameters.
 */
App.prototype.loadProgramAsync = function(fname, onLoad, onProgress)
{
	var self = this;

	// JSON project
	if (fname.endsWith(".isp"))
	{
		FileSystem.readFile(fname, false, function(data)
		{
			var loader = new ObjectLoader();
			self.program = loader.parse(JSON.parse(data));

			if (onLoad !== undefined)
			{
				onLoad(self);
			}
		}, function(event)
		{
			var progress = event.lengthComputable ? event.loaded / event.total * 100 : 0;
			onProgress(progress, event);
		});
	}
	// Binary project
	else if (fname.endsWith(".nsp"))
	{
		FileSystem.readFileArrayBuffer(fname, false, function(data)
		{
			var loader = new ObjectLoader();
			var pson = new StaticPair();

			self.program = loader.parse(pson.decode(data));
			if (onLoad !== undefined)
			{
				onLoad(self);
			}
		}, function(event)
		{
			var progress = event.lengthComputable ? event.loaded / event.total * 100 : 0;
			onProgress(progress, event);
		});
	}
};

/**
 * Update program state and render to the canvas.
 *
 * Automatically called by the runtime handler.
 *
 * @method update
 */
App.prototype.update = function()
{
	this.program.update();
	this.program.render(this.renderer);
};

/**
 * Exit from app.
 *
 * Kills the app and disposes all internal elements to avoid memory leaks.
 *
 * Should be called before exiting the webpage or before switching programs.
 *
 * When loading new programs the same app instance can be used.
 *
 * @method exit
 */
App.prototype.exit = function()
{
	// Destroy events
	this.events.destroy();

	// Dispose program
	if (this.program !== null)
	{
		this.program.dispose();
		this.program = null;
	}

	// Dispose renderer
	if (this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer = null;
	}

	// Run onExit callback if any
	if (this.onExit !== undefined)
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
App.prototype.resume = function()
{
	if (this.program !== null && !this.running)
	{
		var self = this;
		this.renderer.setAnimationLoop(function()
		{
			self.update();
		});

		this.running = true;
	}
};

/**
 * Pause the running application.
 *
 * @method pause
 */
App.prototype.pause = function()
{
	this.running = false;
	this.renderer.setAnimationLoop(null);
};

/**
 * Set the canvas to be used for rendering.
 *
 * Should be set before starting the program.
 *
 * @method setCanvas
 * @param {Component} canvas Canvas
 */
App.prototype.setCanvas = function(canvas)
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
App.prototype.resize = function()
{
	if (this.canvas !== null && this.program !== null && this.renderer !== null)
	{
		var width = 1;
		var height = 1;

		// Automatically fit window
		if (this.canvasFitWindow)
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

		// Device pixel ratio
		if (this.program.handlePixelRatio)
		{
			width *= window.devicePixelRatio;
			height *= window.devicePixelRatio;
		}

		// Update size
		this.renderer.setSize(width, height, false);
		this.program.resize(width, height);
	}
};

/**
 * Send data to running application.
 *
 * The data sent using this method is received by scripts that implement the onAppData method.
 *
 * @param {Object} data Data to send
 * @method sendData
 */
App.prototype.sendData = function(data)
{
	if (this.program !== null)
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
 * @param {Function} callback Function executed whenether the app running sends data to the host
 */
App.prototype.setOnDataReceived = function(callback)
{
	this.onDataReceived = callback;
};

/**
 * Set on exit callback.
 *
 * Callback is executed when exiting the app.
 *
 * @method setOnExit
 * @param {Function} callback onExit callback
 */
App.prototype.setOnExit = function(callback)
{
	this.onExit = callback;
};

/**
 * Check if virtual reality mode is available.
 *
 * @method vrAvailable
 * @return {boolean} True if VR mode available
 */
App.prototype.vrAvailable = function()
{
	return this.program !== null && this.program.vrAvailable();
};

/**
 * Toggle VR mode, only works if VR mode is available.
 *
 * @method toggleVR
 */
App.prototype.toggleVR = function()
{
	if (this.vrAvailable())
	{
		if (this.program.xrEnabled)
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
 * Check if augmented reality mode is available.
 *
 * @method arAvailable
 * @return {boolean} True if VR mode available
 */
App.prototype.arAvailable = function()
{
	return this.program !== null && this.program.vrAvailable();
};

/**
 * Toggle augmented reality mode, only works if augmented reality mode is available.
 *
 * @method toggleAR
 */
App.prototype.toggleAR = function()
{
	if (this.arAvailable())
	{
		if (this.program.xrEnabled)
		{
			this.program.exitAR();
		}
		else
		{
			this.program.enterAR();
		}
	}
	else
	{
		console.warn("nunuStudio: Loaded program is not AR enabled.");
	}
};

/**
 * Set a element to fullscreen mode, if none is passed the rendering canvas is used.
 *
 * @method toggleFullscreen
 * @param {Component} element DOM element to go fullscreen by default the rendering canvas is used
 */
App.prototype.toggleFullscreen = function(element)
{
	var fullscreen = Nunu.isFullscreen();

	if (element === undefined)
	{
		element = this.canvas;
	}

	Nunu.setFullscreen(!fullscreen, element);
};

export {App};
