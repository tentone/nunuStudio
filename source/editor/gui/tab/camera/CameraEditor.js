"use strict";

function CameraEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "camera", Editor.filePath + "icons/camera/camera.png");

	var self = this;

	this.camera = null;
	
	//Canvas
	this.canvas = new RendererCanvas();

	this.form = new TableForm();
	this.form.setAutoSize(false);

	//Main
	this.main = new DualContainer(this);
	this.main.tabPosition = 0.6;
	this.main.attachA(this.canvas);
	this.main.attachB(this.form);

	//Camera
	this.form.addText("Camera");
	this.form.nextRow();

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.camera !== null)
		{
			Editor.history.add(new ChangeAction(self.camera, "name", self.name.getText()));
			Editor.updateObjectsViewsGUI();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	this.form.addText("Post-Processing");
	this.form.nextRow();

	var addRenderPassButton = function(name, PassConstructor)
	{
		var button = new ButtonText(self.form);
		button.size.set(100, 18);
		button.setText(name);
		button.setOnClick(function()
		{
			var pass = new PassConstructor();

			var composer = self.camera.composer;
			pass.renderToScreen = true;
			for(var i = 0; i < composer.passes.length; i++)
			{
				composer.passes[i].renderToScreen = false;
			}
			
			self.camera.composer.addPass(pass);
			self.updatePostNodes();
		});
		self.form.add(button);
	};


	addRenderPassButton("Render", RenderPass);
	addRenderPassButton("FXAA", FXAAPass);
	addRenderPassButton("Colorify", ColorifyPass);
	self.form.nextRow();
	addRenderPassButton("Unreal Bloom", UnrealBloomPass);
	addRenderPassButton("Bloom", BloomPass);
	addRenderPassButton("Hue & Saturation", HueSaturationPass);
	self.form.nextRow();
	addRenderPassButton("SSAO", SSAOPass);
	addRenderPassButton("Bokeh", BokehPass);
	addRenderPassButton("Technicolor", TechnicolorPass);
	self.form.nextRow();
	addRenderPassButton("Film", FilmPass);
	addRenderPassButton("Dot Screen", DotScreenPass);
	addRenderPassButton("Sobel", SobelPass);
	self.form.nextRow();
	addRenderPassButton("Copy", CopyPass);
	self.form.nextRow();

	this.postNodes = new TableForm(this.form);
	this.form.add(this.postNodes);
	this.form.nextRow();
}

CameraEditor.prototype = Object.create(TabElement.prototype);

//Activate
CameraEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	this.name.setText(this.camera.name);
	this.updatePostNodes();
};

//Update post processing nodes
CameraEditor.prototype.updatePostNodes = function()
{
	this.postNodes.removeAll();

	var passes = this.camera.composer.passes;
	for(var i = 0; i < passes.length; i++)
	{
		var node = PassNode.createPass(this.postNodes.element, passes[i].type);
		node.setPass(passes[i]);
		node.setComposer(this.camera.composer);
		node.setEditor(this);

		this.postNodes.add(node);
		this.postNodes.nextRow();
	}
	
	this.postNodes.updateInterface();
	this.form.updateInterface();
};

//Destroy
CameraEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	this.canvas.destroy();
};

//Update tab state
CameraEditor.prototype.update = function()
{
	if(this.camera !== null)
	{
		this.camera.aspect = this.canvas.size.x / this.canvas.size.y;
		this.camera.updateProjectionMatrix();
		this.camera.resize(this.canvas.size.x, this.canvas.size.y);
		this.camera.render(this.canvas.renderer, this.camera.getScene());
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

CameraEditor.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.main.size.copy(this.size);
	this.main.updateInterface();
};
