/**
 * Nunu app is the main class of the runtime system, is used to embed projects into external webpages and applications.
 *
 * Project files can be loaded directly from their project files into any kind of project. The app class handles all the runtime and control of the application lifecycle.
 * 
 * @class NunuApp
 * @module Runtime
 * @constructor
 * @param {Component} canvas Canvas to be used by the runtime, if no canvas is provided a new one is created and added to the document.body, to create a new NunuApp without canvas a null value can be passed.
 */
function NunuApp(canvas)
{
	/**
	 * Nunu Program
	 * @property program
	 * @type {Program}
	 */
	this.program = null;

	/**
	 * Graphics renderer in use by this NunuApp instance
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
	 * Flag used to controll if the canvas element is resized automatically by the nunu app instance.
	 * 
	 * If true the canvas is resized whenether the resize method is called.
	 * 
	 * @property canvasFitWindow
	 * @type {boolean}
	 * @default false if a canvas is provided, else true
	 */
	this.canvasFitWindow = false;

	/**
	 * Canvas used to render graphics.
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

	if(canvas === undefined)
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
 * Load a nunustudio application and attach it to the canvas indicated.
 *
 * This method automatically creates resize events, this single line should be enough to make a nunuStudio app run in a webpage.
 *
 * @static
 * @method loadApp
 * @param {string} url URL for the nsp or isp nunuStudio file.
 * @param {string} canvas Canvas object or canvas id.
 */
NunuApp.loadApp = function(url, canvas)
{	
	if(typeof canvas === "string")
	{
		canvas = document.getElementById(canvas);
	}

	var app = new NunuApp(canvas);
	app.loadRunProgram(url);

	window.addEventListener("resize", function()
	{
		if(Nunu.isFullscreen())
		{
			app.canvas.width = window.innerWidth;
			app.canvas.height = window.innerHeight;
		}
		else
		{
			app.canvas.width = nunuApps[i].canvas.parentElement.offsetWidth;
			app.canvas.height = nunuApps[i].canvas.parentElement.offsetWidth;
		}
		app.resize();
	});
};

/**
 * Start running nunu program.
 *
 * Creates renderer, mouse and keyboard objects, and starts running the loaded application.
 * 
 * A nunu program must be loaded before calling this method.
 * 
 * @method run
 */
NunuApp.prototype.run = function()
{
	if(this.program === null)
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
	if(this.program.lockPointer)
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
 * @param {Function} onProgress onProgress callback
 */
NunuApp.prototype.loadRunProgram = function(fname, onLoad, onProgress)
{
	this.loadProgramAsync(fname, function(app)
	{
		app.run();

		if(onLoad !== undefined)
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
NunuApp.prototype.loadProgram = function(fname)
{
	// JSON project
	if(fname.endsWith(".isp"))
	{
		var loader = new ObjectLoader();
		var data = FileSystem.readFile(fname);
		this.program = loader.parse(JSON.parse(data));
	}
	// Binary project
	else if(fname.endsWith(".nsp"))
	{
		var loader = new ObjectLoader();
		var data = FileSystem.readFileArrayBuffer(fname);
		var pson = new dcodeIO.PSON.StaticPair();
		this.program = loader.parse(pson.decode(data));
	}
};

/**
 * Load program from file, asynchronously.
 * 
 * @method loadProgramAsync
 * @param {string} fname Name of the file to load
 * @param {Function} onLoad onLoad callback. Receives as argument the loaded application.
 * @param {Function} onProgress onProgress callback
 */
NunuApp.prototype.loadProgramAsync = function(fname, onLoad, onProgress)
{
	var self = this;

	// JSON project
	if(fname.endsWith(".isp"))
	{
		FileSystem.readFile(fname, false, function(data)
		{
			var loader = new ObjectLoader();
			self.program = loader.parse(JSON.parse(data));
			
			if(onLoad !== undefined)
			{
				onLoad(self);
			}
		}, onProgress);
	}
	// Binary project
	else if(fname.endsWith(".nsp"))
	{
		FileSystem.readFileArrayBuffer(fname, false, function(data)
		{
			var loader = new ObjectLoader();
			var pson = new dcodeIO.PSON.StaticPair();
			self.program = loader.parse(pson.decode(data));

			if(onLoad !== undefined)
			{
				onLoad(self);
			}
		}, onProgress);
	}
};

/**
 * Update nunu program state.
 * 
 * Automatically called by the runtime handler.
 * 
 * @method update
 */
NunuApp.prototype.update = function()
{
	this.program.update();
	this.program.render(this.renderer);
};

/**
 * Exit from app.
 * 
 * This method kills the app and disposes all internal elements to avoid memory leaks.
 * 
 * Is should be called before exiting the webpage or before switching nunu programs.
 * 
 * When loading new nunu programs the same NunuApp instance can be used.
 * 
 * @method exit
 */
NunuApp.prototype.exit = function()
{
	// Destroy events
	this.events.destroy();

	// Dispose program
	if(this.program !== null)
	{
		this.program.dispose();
		this.program = null;
	}

	// Dispose renderer
	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer = null;
	}

	// Run onExit callback if any
	if(this.onExit !== undefined)
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
NunuApp.prototype.resume = function()
{
	if(this.program !== null && !this.running)
	{
		var self = this;
		var update = function()
		{
			if(self.running)
			{
				self.update();
				requestAnimationFrame(update);
			}
		};
		this.running = true;
		update();
	}
};

/**
 * Pause the running application.
 *
 * @method pause
 */
NunuApp.prototype.pause = function()
{
	this.running = false;
};

/**
 * Set the canvas to be used for rendering.
 *
 * Should be set before starting the program.
 *
 * @method setCanvas
 * @param {Component} canvas Canvas
 */
NunuApp.prototype.setCanvas = function(canvas)
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
NunuApp.prototype.resize = function()
{
	if(this.canvas !== null && this.program !== null && this.renderer !== null)
	{
		var width = 1;
		var height = 1;

		// Automatically fit window
		if(this.canvasFitWindow)
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
		if(this.program.handlePixelRatio)
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
 * Send data to running nunu application.
 * 
 * The data sent using this method is received by scripts that implement the onAppData method.
 * 
 * @param {Object} data Data to send
 * @method sendData
 */
NunuApp.prototype.sendData = function(data)
{
	if(this.program !== null)
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
 * @param {Function} callback Function executed whenether the nunu app running sends data to the host
 */
NunuApp.prototype.setOnDataReceived = function(callback)
{
	this.onDataReceived = callback;
};

/**
 * Set on exit callback.
 * 
 * Callback is executed when exiting the nunu app.
 * 
 * @method setOnExit
 * @param {Function} callback onExit callback
 */
NunuApp.prototype.setOnExit = function(callback)
{
	this.onExit = callback;
};

/**
 * Check if virtual reality mode is available.
 * 
 * @method vrAvailable
 * @return {boolean} True if VR mode available
 */
NunuApp.prototype.vrAvailable = function()
{
	return this.program !== null && this.program.vrAvailable();
};

/**
 * Toggle VR mode, only works if VR mode is available.
 * 
 * @method toggleVR
 */
NunuApp.prototype.toggleVR = function()
{
	if(this.vrAvailable())
	{
		if(this.program.vrRunning)
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
 * Set a element to fullscreen mode, if none is passed the rendering canvas is used.
 *
 * @method toggleFullscreen
 * @param {Component} element DOM element to go fullscren by default the rendering canvas is used
 */
NunuApp.prototype.toggleFullscreen = function(element)
{
	var fullscreen = Nunu.isFullscreen();

	if(element === undefined)
	{
		element = this.canvas;
	}

	Nunu.setFullscreen(!fullscreen, element);
};
