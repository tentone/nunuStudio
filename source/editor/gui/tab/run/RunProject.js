"use strict";

/** 
 * Tab used to preview a project running.
 *
 * Clones the project instance and run it. Changes appplied in other tabs are not applied to the running instance.
 *
 * @class RunProject
 * @extends {TabElement}
 */
function RunProject(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, Locale.run, Editor.FILE_PATH + "icons/misc/play.png");

	var self = this;

	/**
	 * Keyboard input object.
	 *
	 * @attribute keyboard
	 * @type {Keyboard}
	 */
	this.keyboard = new Keyboard(true);

	/** 
	 * Mouse input object
	 *
	 * It is attached to the window object to capture movement outside of the tab division.
	 *
	 * @attribute mouse
	 * @type {Mouse}
	 */
	this.mouse = new Mouse(window, true);

	/**
	 * WebGL renderer used to draw the objects
	 *
	 * @attribute renderer
	 * @type {THREE.WebGLRenderer}
	 */
	this.renderer = null;

	/**
	 * Canvas element to where the renderer outputs.
	 *
	 * @attribute canvas
	 * @type {DOM}
	 */
	this.canvas = null;

	/**
	 * Indicates if the background of the canvas is transparent or not.
	 *
	 * @attribute alpha
	 * @type {Boolean}
	 */
	this.alpha = true;
	this.resetCanvas();

	/**
	 * Program being run on this tab.
	 *
	 * @attribute program
	 * @type {Program}
	 */
	this.program = null;

	/**
	 * Performance meter GUI.
	 *
	 * @attribute stats
	 * @type {Stats}
	 */
	this.stats = new Stats();
	this.stats.dom.style.position = "absolute";
	this.stats.dom.style.display = "none";
	this.stats.dom.style.left = "0px";
	this.stats.dom.style.top = "0px";
	this.stats.dom.style.zIndex = "0";
	this.element.appendChild(this.stats.dom);

	/**
	 * Fullscreen button used to toggle fullscreen mode.
	 *
	 * @attribute fullscreenButton
	 * @type {ButtonImage}
	 */
	this.fullscreenButton = new ButtonImage(this);
	this.fullscreenButton.position.set(5, 5);
	this.fullscreenButton.size.set(30, 30);
	this.fullscreenButton.setImage(Editor.FILE_PATH + "icons/misc/fullscreen.png");
	this.fullscreenButton.setAltText(Locale.toggleFullscreen);
	this.fullscreenButton.setImageScale(0.8, 0.8);
	this.fullscreenButton.updateSize();
	this.fullscreenButton.updatePosition(Element.BOTTOM_RIGHT);
	this.fullscreenButton.visible = false;
	this.fullscreenButton.element.style.backgroundColor = "#333333";
	this.fullscreenButton.element.style.borderRadius = "5px";
	this.fullscreenButton.element.style.opacity = 0.5;
	this.fullscreenButton.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.fullscreenButton.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};

	var fullscreen = true;
	this.fullscreenButton.setOnClick(function()
	{
		self.setFullscreen(fullscreen);
		fullscreen = !fullscreen;
	});

	/**
	 * VR button used to toggle vr mode.
	 *
	 * It is only displayed when VR is available.
	 *
	 * @attribute vrButton
	 * @type {ButtonImage}
	 */
	this.vrButton = new ButtonImage(this);
	this.vrButton.size.set(30, 30);
	this.vrButton.position.set(40, 5);
	this.vrButton.setImage(Editor.FILE_PATH + "icons/misc/vr.png");
	this.vrButton.setAltText(Locale.toggleVR);
	this.vrButton.setImageScale(0.8, 0.8);
	this.vrButton.updateSize();
	this.vrButton.updatePosition(Element.BOTTOM_RIGHT);
	this.vrButton.visible = false;
	this.vrButton.element.style.backgroundColor = "#333333";
	this.vrButton.element.style.borderRadius = "5px";
	this.vrButton.element.style.opacity = 0.5;
	this.vrButton.element.onmouseenter = function()
	{
		this.style.opacity = 1.0;
	};
	this.vrButton.element.onmouseleave = function()
	{
		this.style.opacity = 0.5;
	};
}

RunProject.prototype = Object.create(TabElement.prototype);

RunProject.prototype.reloadContext = RendererCanvas.prototype.reloadContext;
RunProject.prototype.forceContextLoss = RendererCanvas.prototype.forceContextLoss;

RunProject.prototype.createRenderer = function()
{
	this.renderer = Editor.program.rendererConfig.createRenderer(this.canvas);
};


RunProject.prototype.activate = function()
{
	this.createRenderer();
	this.updateSettings();

	this.mouse.create();
	this.keyboard.create();

	if(this.program === null)
	{
		this.getProgram();
		this.runProgram();
	}

	Editor.gui.menuBar.run.setText(Locale.stop);

	TabElement.prototype.activate.call(this);
};

RunProject.prototype.deactivate = function()
{
	TabElement.prototype.deactivate.call(this);

	this.mouse.dispose();
	this.keyboard.dispose();

	Editor.gui.menuBar.run.setText(Locale.run);
};

RunProject.prototype.isAttached = function(program)
{
	return program === Editor.program;
};


RunProject.prototype.updateSettings = function()
{
	this.stats.dom.style.display = (Editor.settings.general.showStats && this.visible) ? "block" : "none";
};

RunProject.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	this.stopProgram();
	
	this.mouse.dispose();
	this.keyboard.dispose();

	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer = null;
	}
};

/**
 * Set fullscreen mode of the tab canvas
 *
 * @method setFullscreen
 * @param {Boolean} fullscreen If true enters fullscreen if false exits fullscreen.
 */
RunProject.prototype.setFullscreen = function(fullscreen)
{
	if(fullscreen)
	{
		Nunu.setFullscreen(true, this.element);

		this.position.set(0, 0);	
		this.size.set(window.screen.width, window.screen.height);
		this.updateInterface();
	}
	else
	{
		Nunu.setFullscreen(false);
		Editor.gui.updateInterface();
	}
};

/** 
 * Dispose runnning program.
 *
 * @method stopProgram
 */
RunProject.prototype.stopProgram = function()
{
	this.setFullscreen(false);
	this.mouse.setLock(false);

	if(this.program !== null)
	{
		this.program.dispose();
		this.program = null;
	}
};

/**
 * Update the program logic and render the program to the canvas using the renderer.
 *
 * @method update
 */
RunProject.prototype.update = function()
{
	if(this.program === null)
	{
		return;
	}

	this.mouse.update();
	this.keyboard.update();

	if(this.stats !== null)
	{
		this.stats.begin();
	}

	try
	{
		this.program.update();
	}
	catch(error)
	{
		Editor.alert(Locale.errorRunRender + "\n(" + error + ")");
		console.warn("nunuStudio: Error while running program.", error);
		this.close();
		return;
	}

	try
	{
		this.program.render(this.renderer);
	}
	catch(error)
	{
		Editor.alert(Locale.errorRunRender + "\n(" + error + ")");
		console.warn("nunuStudio: Error while rendering program.", error);
		this.close();
		return;
	}

	if(this.stats !== null)
	{
		this.stats.end();
	}
};


RunProject.prototype.resetCanvas = function()
{
	RendererCanvas.prototype.resetCanvas.call(this);

	this.mouse.setCanvas(this.canvas);
};

/** 
 * Get the Editor.program object to be run in this tab.
 *
 * @method getProgram
 */
RunProject.prototype.getProgram = function()
{
	//Run the program directly all changed made with code are kept
	if(Editor.settings.general.immediateMode)
	{
		this.program = Editor.program;
	}
	//Run a copy of the program
	else
	{
		this.program = Editor.program.clone();
	}
};

/** 
 * Prepare the program to be run, create a default camera.
 *
 * Run the initialization scripts from the object and set the renderer size.
 *
 * @method runProgram
 */
RunProject.prototype.runProgram = function()
{
	try
	{
		//Create a default camera for program (same as runtime).
		this.program.defaultCamera = new PerspectiveCamera(60, 1, 0.1, 1e5);
		this.program.defaultCamera.position.set(0, 5, -5);
		
		this.program.setRenderer(this.renderer);
		this.program.setMouseKeyboard(this.mouse, this.keyboard);
		this.program.initialize();
		this.program.resize(this.canvas.width, this.canvas.height);
	}
	catch(error)
	{
		Editor.alert(Locale.errorRunInitialize + "\n(" + error + ")");
		console.warn("nunuStudio: Error while initializing program.", error);
		this.close();
		return;
	}

	//If program uses VR set button
	if(this.program.vr === true)
	{
		if(Nunu.webvrAvailable())
		{
			//Show VR button
			this.vrButton.setVisibility(true);

			//Create VR switch callback
			var vr = true;
			var self = this;
			this.vrButton.setOnClick(function()
			{
				if(vr)
				{
					self.program.displayVR();
				}
				else
				{
					self.program.exitVR();
				}

				vr = !vr;
			});
		}
	}

	//Lock mouse pointer
	if(this.program.lockPointer)
	{
		this.mouse.setLock(true);
	}
};

/** 
 * Restart the program running in the tab.
 *
 * @method restartProgram
 */
RunProject.prototype.restartProgram = function()
{
	this.stopProgram();
	this.getProgram();
	this.runProgram();
};

/**
 * Resize canvas and camera to match the size of the tab.
 *
 * Also applies the window.devicePixelRatio to the canvas size.
 *
 * @method resizeCanvas
 */
RunProject.prototype.resizeCanvas = function()
{
	var width = this.size.x * window.devicePixelRatio;
	var height = this.size.y * window.devicePixelRatio;

	this.canvas.style.width = this.size.x + "px";
	this.canvas.style.height = this.size.y + "px";

	if(this.renderer !== null)
	{
		this.renderer.setSize(this.size.x, this.size.y, false);

		if(this.program !== null)
		{
			this.program.resize(width, height);
		}
	}
};

RunProject.prototype.updateVisibility = function()
{
	TabElement.prototype.updateVisibility.call(this);

	this.stats.dom.style.display = (Editor.settings.general.showStats && this.visible) ? "block" : "none";
};

RunProject.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.resizeCanvas();
};
