"use strict";

function CameraEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "camera", Editor.filePath + "icons/camera/camera.png");

	this.camera = null;
	
	//Main container
	this.main = new DualDivisionResizable(this.element);
	this.main.tabPosition = 0.6;
	this.main.tabPositionMin = 0.05;
	this.main.tabPositionMax = 0.95;

	//Canvas
	this.canvas = new Canvas(this.main.divA);

	//Renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.render.antialiasing});

	//Change main div aspect
	this.main.divB.style.overflow = "auto";
	this.main.divB.style.cursor = "default";
	this.main.divB.style.backgroundColor = Editor.theme.panelColor;

	//Self pointer
	var self = this;

	//Form
	this.form = new Form(this.main.divB);
	this.form.defaultTextWidth = 80;
	this.form.position.set(10, 5);
	this.form.spacing.set(5, 5);

	//Camera
	this.form.addText("Camera");
	this.form.nextRow();

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.camera !== null)
		{
			Editor.history.add(new ChangeAction(self.camera, "name", self.name.getText()));
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	this.form.addText("Add Post Processing");
	this.form.nextRow();

	var addRenderPass = function(pass)
	{
		console.log(pass);
		var composer = self.camera.composer;

		for(var i = 0; i < composer.passes.length; i++)
		{
			composer.passes[i].renderToScreen = false;
		}
		
		self.camera.composer.addPass(pass);
	};

	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("Render");
	button.setCallback(function()
	{
		var pass = new RenderPass();
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();

	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("FXAA");
	button.setCallback(function()
	{
		var pass = new FXAAPass();
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();

	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("Unreal Bloom");
	button.setCallback(function()
	{
		var pass = new UnrealBloomPass(0.8, 0.3, 0.8);
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();

	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("SSAO");
	button.setCallback(function()
	{
		var pass = new SSAOPass();
		pass.onlyAO = false;
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();

	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("Bokeh");
	button.setCallback(function()
	{
		var pass = new BokehPass();
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();
	
	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("Film");
	button.setCallback(function()
	{
		var pass = new FilmPass(0.35, 0.5, 512, false);
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();

	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("Dot Screen");
	button.setCallback(function()
	{
		var pass = new DotScreenPass(new THREE.Vector2(0, 0), 0.5, 0.8);
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();

	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("Sobel");
	button.setCallback(function()
	{
		var pass = new SobelPass();
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();

	var button = new Button(this.form.element);
	button.size.set(120, 18);
	button.setText("Copy");
	button.setCallback(function()
	{
		var pass = new CopyPass();
		pass.renderToScreen = true;

		addRenderPass(pass);
	});
	this.form.add(button);
	this.form.nextRow();

	this.postNodes = new Form(this.form.element);
	this.form.add(this.postNodes);
	this.form.nextRow();
}

CameraEditor.prototype = Object.create(TabElement.prototype);

//Activate
CameraEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);
	
	this.name.setText(this.camera.name);

	//Post processing nodes
	var passes = this.camera.composer.passes;
	for(var i = 0; i < passes.length; i++)
	{
		var node = null;

		if(passes[i].type === "UnrealBloom")
		{
			node = new UnrealBloomPassNode(this.postNodes.element);
		}
		else if(passes[i].type === "Bokeh")
		{
			node = new BokehPassNode(this.postNodes.element);
		}
		else
		{
			node = new RenderPassNode(this.postNodes.element);
		}

		node.setPass(passes[i]);
		node.setComposer(this.camera.composer);
		this.postNodes.add(node);
		this.postNodes.nextRow();
	}
	this.postNodes.updateInterface();
};

//Destroy
CameraEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer = null;
	}
};

//Update tab state
CameraEditor.prototype.update = function()
{
	if(this.camera !== null)
	{
		this.camera.aspect = this.canvas.size.x / this.canvas.size.y;
		this.camera.updateProjectionMatrix();
		this.camera.resize(this.canvas.size.x, this.canvas.size.y);

		this.camera.render(this.renderer, ObjectUtils.getScene(this.camera));
	}
};

//Update tab metadata
CameraEditor.prototype.updateMetadata = function()
{
	if(this.camera !== null)
	{
		this.setName(this.camera.name);
		this.name.setText(this.camera.name);

		//Check if object has a parent
		if(this.camera.parent === null)
		{
			this.close();
			return;
		}

		//Check if object exists in parent
		var children = this.camera.parent.children;
		for(var i = 0; i < children.length; i++)
		{
			if(this.camera.uuid === children[i].uuid)
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

CameraEditor.prototype.attach = function(camera)
{
	this.camera = camera;

	this.updateMetadata();
};

CameraEditor.prototype.isAttached = function(camera)
{
	return this.camera === camera;
};

CameraEditor.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Form
		this.form.updateInterface();

		//Main
		this.main.size.copy(this.size);
		this.main.updateInterface();

		//Canvas
		this.canvas.size.set(this.main.divA.offsetWidth, this.main.divA.offsetHeight);
		this.canvas.updateInterface();

		//Renderer
		this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
