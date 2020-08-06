import {Locale} from "../../../locale/LocaleManager.js";
import {Program} from "../../../../core/objects/Program.js";
import {PerspectiveCamera} from "../../../../core/objects/cameras/PerspectiveCamera.js";
import {Nunu} from "../../../../core/Nunu.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {TabComponent} from "../../../components/tabs/TabComponent.js";
import {RendererCanvas} from "../../../components/RendererCanvas.js";
import {Component} from "../../../components/Component.js";
import {ButtonIcon} from "../../../components/buttons/ButtonIcon.js";

/** 
 * Tab used to preview a project running.
 *
 * Clones the project instance and run it. Changes appplied in other tabs are not applied to the running instance.
 *
 * @class RunProject
 * @extends {TabComponent}
 */
function RunProject(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.run, Global.FILE_PATH + "icons/misc/play.png");

	var self = this;

	/**
	 * Rendering canvas element where the program is presented.
	 *
	 * @attribute canvas
	 * @type {RendererCanvas}
	 */
	this.canvas = new RendererCanvas(this, Editor.program.rendererConfig);

	/**
	 * Program being run on this tab.
	 *
	 * @attribute program
	 * @type {Program}
	 */
	this.program = null;

	/**
	 * Fullscreen button used to toggle fullscreen mode.
	 *
	 * @attribute fullscreenButton
	 * @type {ButtonIcon}
	 */
	this.fullscreenButton = new ButtonIcon(this);
	this.fullscreenButton.position.set(5, 5);
	this.fullscreenButton.size.set(30, 30);
	this.fullscreenButton.setImage(Global.FILE_PATH + "icons/misc/fullscreen.png");
	this.fullscreenButton.setAltText(Locale.toggleFullscreen);
	this.fullscreenButton.setImageScale(0.8, 0.8);
	this.fullscreenButton.updateSize();
	this.fullscreenButton.updatePosition(Component.BOTTOM_RIGHT);
	this.fullscreenButton.setStyle("borderRadius", "5px");
	this.fullscreenButton.setVisibility(true);
	this.fullscreenButton.updateSyles({backgroundColor: "var(--panel-color)", opacity: 0.5}, {backgroundColor: "var(--panel-color)", opacity: 1.0});

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
	 * @type {ButtonIcon}
	 */
	this.vrButton = new ButtonIcon(this);
	this.vrButton.size.set(30, 30);
	this.vrButton.position.set(40, 5);
	this.vrButton.setImage(Global.FILE_PATH + "icons/misc/vr.png");
	this.vrButton.setAltText(Locale.toggleVR);
	this.vrButton.setImageScale(0.8, 0.8);
	this.vrButton.updateSize();
	this.vrButton.updatePosition(Component.BOTTOM_RIGHT);
	this.vrButton.setVisibility(false);
	this.vrButton.setStyle("borderRadius", "5px");
	this.vrButton.updateSyles({backgroundColor: "var(--panel-color)", opacity: 0.5}, {backgroundColor: "var(--panel-color)", opacity: 1.0});

	/**
	 * AR button used to toggle ar mode.
	 *
	 * It is only displayed when AR is available.
	 *
	 * @attribute arButton
	 * @type {ButtonIcon}
	 */
	this.arButton = new ButtonIcon(this);
	this.arButton.size.set(30, 30);
	this.arButton.position.set(75, 5);
	this.arButton.setImage(Global.FILE_PATH + "icons/misc/ar.png");
	this.arButton.setAltText(Locale.toggleAR);
	this.arButton.setImageScale(0.8, 0.8);
	this.arButton.updateSize();
	this.arButton.updatePosition(Component.BOTTOM_RIGHT);
	this.arButton.setVisibility(false);
	this.arButton.setStyle("borderRadius", "5px");
	this.arButton.updateSyles({backgroundColor: "var(--panel-color)", opacity: 0.5}, {backgroundColor: "var(--panel-color)", opacity: 1.0});
}

RunProject.prototype = Object.create(TabComponent.prototype);

RunProject.prototype.reloadContext = RendererCanvas.prototype.reloadContext;
RunProject.prototype.forceContextLoss = RendererCanvas.prototype.forceContextLoss;

RunProject.prototype.activate = function()
{
	this.canvas.createRenderer();
	this.updateSettings();

	if(this.program === null)
	{
		this.getProgram();
		this.runProgram();
	}

	Editor.gui.menuBar.run.setText(Locale.stop);

	TabComponent.prototype.activate.call(this);
};

RunProject.prototype.deactivate = function()
{
	TabComponent.prototype.deactivate.call(this);

	Editor.gui.menuBar.run.setText(Locale.run);
};

RunProject.prototype.isAttached = function(program)
{
	return program === Editor.program;
};

RunProject.prototype.destroy = function()
{
	TabComponent.prototype.destroy.call(this);

	this.stopProgram();

	this.canvas.forceContextLoss();
};

/**
 * Set fullscreen mode of the tab canvas.
 *
 * @method setFullscreen
 * @param {boolean} fullscreen If true enters fullscreen if false exits fullscreen.
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

	if(this.program !== null)
	{
		this.program.dispose();
		this.program = null;
	}

	this.canvas.renderer.setAnimationLoop(null);
};

RunProject.prototype.resetCanvas = function()
{
	RendererCanvas.prototype.resetCanvas.call(this);

	if(this.program !== null && this.program.mouse !== null)
	{
		this.program.mouse.setCanvas(this.canvas.canvas);
	}
};

/** 
 * Get the Editor.program object to be run in this tab.
 *
 * @method getProgram
 */
RunProject.prototype.getProgram = function()
{
	// Run the program directly all changed made with code are kept
	if(Editor.settings.general.immediateMode)
	{
		this.program = Editor.program;
	}
	// Run a copy of the program
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
		// Create a default camera for program (same as runtime).
		this.program.defaultCamera = new PerspectiveCamera(60, 1, 0.1, 1e5);
		this.program.defaultCamera.position.set(0, 5, -5);
		
		// Set runtime variables
		this.program.setRenderer(this.canvas.renderer);
		this.program.initialize();
		this.program.resize(this.canvas.canvas.width, this.canvas.canvas.height);
	}
	catch(error)
	{
		Editor.alert(Locale.errorRunInitialize + "\n(" + error + ")");
		console.warn("nunuStudio: Error while initializing program.", error);
		this.close();
		return;
	}

	// If program uses VR set button
	if(this.program.vrAvailable())
	{
		// Show VR button
		this.vrButton.setVisibility(true);
		this.vrButton.position.set(40, 5);
		
		// Create VR switch callback
		var program = this.program;
		this.vrButton.setOnClick(function()
		{
			if(program.xrEnabled)
			{
				program.exitVR();
			}
			else
			{
				program.enterVR();
			}
		});
	}

	if(this.program.arAvailable())
	{
		// Show AR button
		this.arButton.setVisibility(true);
		this.arButton.position.set(this.program.vrAvailable() ? 75 : 40, 5);

		var program = this.program;
		this.arButton.setOnClick(function()
		{
			if(program.xrEnabled)
			{
				program.exitAR();
			}
			else
			{
				program.enterAR();
			}
		});
	}

	var self = this;

	//Update the program logic and render the program to the canvas using the renderer.
	this.canvas.renderer.setAnimationLoop(function()
	{
		if(self.program === null)
		{
			return;
		}

		try
		{
			self.program.update();
		}
		catch(error)
		{
			Editor.alert(Locale.errorRunRender + "\n(" + error + ")");
			console.warn("nunuStudio: Error while running program.", error);
			self.close();
			return;
		}

		try
		{
			self.program.render(self.canvas.renderer);
		}
		catch(error)
		{
			Editor.alert(Locale.errorRunRender + "\n(" + error + ")");
			console.warn("nunuStudio: Error while rendering program.", error);
			self.close();
			return;
		}
	});
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

RunProject.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.canvas.size.copy(this.size);
	this.canvas.updateSize();

	if(this.program !== null)
	{
		this.program.resize(this.canvas.size.x, this.canvas.size.y);
	}
};

export {RunProject};