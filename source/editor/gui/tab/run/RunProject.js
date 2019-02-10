"use strict";

//TODO <NOT IN USE>
function RunProject(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Scene", Editor.FILE_PATH + "icons/misc/scene.png");

	var self = this;

	//Input
	this.keyboard = new Keyboard();
	this.mouse = new Mouse(window, true);

	//Renderer
	this.renderer = null;

	//Canvas
	this.canvas = null;
	this.alpha = true;
	this.resetCanvas();

	//Test program
	this.program = null;

	//Performance meter
	this.stats = new Stats();
	this.stats.dom.style.position = "absolute";
	this.stats.dom.style.display = "none";
	this.stats.dom.style.left = "0px";
	this.stats.dom.style.top = "0px";
	this.stats.dom.style.zIndex = "0";
	this.element.appendChild(this.stats.dom);

	//Fullscreen button
	this.fullscreenButton = new ButtonImage(this);
	this.fullscreenButton.position.set(5, 5);
	this.fullscreenButton.size.set(30, 30);
	this.fullscreenButton.setImage(Editor.FILE_PATH + "icons/misc/fullscreen.png");
	this.fullscreenButton.setAltText("Toggle fullscreen");
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

	//VR button
	this.vrButton = new ButtonImage(this);
	this.vrButton.size.set(30, 30);
	this.vrButton.position.set(40, 5);
	this.vrButton.setImage(Editor.FILE_PATH + "icons/misc/vr.png");
	this.vrButton.setAltText("Toggle VR mode");
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

RunProject.prototype.createRenderer = RendererCanvas.prototype.createRenderer;
RunProject.prototype.reloadContext = RendererCanvas.prototype.reloadContext;
RunProject.prototype.forceContextLoss = RendererCanvas.prototype.forceContextLoss;

RunProject.prototype.updateMetadata = function()
{
	if(this.scene !== null)
	{
		this.setName(this.scene.name);

		//Check if object has a parent
		if(this.scene.parent === null)
		{
			this.close();
			return;
		}

		//Check if object exists in parent
		var children = this.scene.parent.children;
		for(var i = 0; i < children.length; i++)
		{
			if(this.scene.uuid === children[i].uuid)
			{
				return;
			}
		}

		//If not found close tab
		if(i >= children.length)
		{
			this.close();
		}
	}
};

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

RunProject.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	if(this.scene instanceof Scene)
	{
		Editor.program.scene = this.scene;
	}

	this.createRenderer();
	this.updateSettings();
	this.setState(RunProject.EDITING);

	this.mouse.create();
	this.manager.create();

	Editor.gui.toolBar.selectTool(Editor.SELECT);
};

RunProject.prototype.deactivate = function()
{
	TabElement.prototype.deactivate.call(this);

	Editor.gui.menuBar.run.visible = false;
	Editor.gui.menuBar.run.updateInterface();

	this.mouse.dispose();
	this.manager.destroy();
};

RunProject.prototype.updateSettings = function()
{
	this.stats.dom.style.display = (Editor.settings.general.showStats && this.visible) ? "block" : "none";
};

RunProject.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	this.mouse.dispose();
	this.keyboard.dispose();
	this.tool.dispose();

	this.disposeRunningProgram();

	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer = null;
	}
};

RunProject.prototype.attach = function(scene)
{
	this.scene = scene;
	this.updateMetadata();
};

RunProject.prototype.isAttached = function(scene)
{
	return this.scene === scene;
};

//Update scene editor logic
RunProject.prototype.update = function()
{
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
	catch(e)
	{
		Editor.alert("Error testing program\nState update caused an error\n(" + e + ")");
		console.error("nunuStudio: Error updating program state", e);
	}

	this.render();

	if(this.stats !== null)
	{
		this.stats.end();
	}
};

RunProject.prototype.render = function()
{
	try
	{
		this.program.render(renderer, this.canvas.width, this.canvas.height);
	}
	catch(e)
	{
		Editor.alert("Error testing program\nRender caused an error\n(" + e + ")");
		console.error("nunuStudio: Error rendering program", e);
	}
};

RunProject.prototype.resetCanvas = function()
{
	RendererCanvas.prototype.resetCanvas.call(this);

	this.mouse.setCanvas(this.canvas);
};

//Set scene editor state
RunProject.prototype.setState = function(state)
{
	this.state = state;

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
	
	//Use editor camera as default camera for program
	this.program.defaultCamera = this.camera;
	this.program.setRenderer(this.renderer);

	//Initialize scene
	this.program.setMouseKeyboard(this.mouse, this.keyboard);
	this.program.initialize();
	this.program.resize(this.canvas.width, this.canvas.height);

	//Show full screen and VR buttons
	this.fullscreenButton.setVisibility(true);
	this.cameraButton.setVisibility(false);
	this.transformationSpace.setVisibility(false);
	this.navigation.setVisibility(false);

	//If program uses VR set button
	if(this.program.vr)
	{
		if(Nunu.webvrAvailable())
		{
			//Show VR button
			this.vrButton.setVisibility(true);

			//Create VR switch callback
			var vr = true;
			this.vrButton.setOnClick(function()
			{
				if(vr)
				{
					this.program.displayVR();
				}
				else
				{
					this.program.exitVR();
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

	//Renderer size
	this.renderer.setViewport(0, 0, this.canvas.width, this.canvas.height);
	this.renderer.setScissor(0, 0, this.canvas.width, this.canvas.height);

	//Run button text
	Editor.gui.menuBar.run.setText("Stop");
	Editor.gui.menuBar.run.visible = true;
	Editor.gui.menuBar.run.updateInterface();

	//Update interface
	this.updateInterface();
};

//Dispose running program if there is one
RunProject.prototype.disposeRunningProgram = function()
{
	//Dispose running program if there is one
	if(this.program !== null)
	{
		this.setFullscreen(false);
		this.program.dispose();
		this.program = null;
	}

	//Unlock mouse
	this.mouse.setLock(false);
};

//Resize scene editor canvas and camera
RunProject.prototype.resizeCanvas = function()
{
	var width = this.size.x * window.devicePixelRatio;
	var height = this.size.y * window.devicePixelRatio;

	this.canvas.width = width;
	this.canvas.height = height;
	this.canvas.style.width = this.size.x + "px";
	this.canvas.style.height = this.size.y + "px";

	if(this.renderer !== null)
	{
		this.renderer.setSize(this.size.x, this.size.y, false);

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		if(this.state === RunProject.TESTING)
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
