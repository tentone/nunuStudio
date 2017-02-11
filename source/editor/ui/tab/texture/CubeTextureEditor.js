"use strict";

function CubeTextureEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Texture", "editor/files/icons/misc/image.png");

	var self = this;

	this.Texture = null;

	//Dual division
	this.division = new DualDivisionResizable(this.element);
	this.division.setOnResize(function()
	{
		self.updateInterface();
	});
	this.division.tabPosition = 0.5;
	this.division.tabPositionMin = 0.3;
	this.division.tabPositionMax = 0.7;

	//Canvas
	this.canvas = new Canvas(this.division.divA);

	//Renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = false;

	//Camera
	this.camera = new PerspectiveCamera(100, this.canvas.width/this.canvas.height);

	//Scene
	this.scene = new THREE.Scene();

	//Cube map
	var urls = ["data/sample.png","data/sample.png","data/sample.png","data/sample.png","data/sample.png","data/sample.png"];
	this.texture = new THREE.CubeTextureLoader().load(urls);
	this.texture.format = THREE.RGBFormat;
	this.texture.mapping = THREE.CubeRefractionMapping;
	this.scene.background = this.texture;

	//Form
	this.form = new Form(this.division.divB);
	this.form.position.set(10, 5);
	this.form.spacing.set(5, 5);

	this.form.addText("Cube Texture Editor");
	this.form.nextRow();

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.name = self.name.getText();
			self.updateMaterial();
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Minification filter
	this.form.addText("Min. filter");
	this.minFilter = new DropdownList(this.form.element);
	this.minFilter.size.set(150, 18);
	this.minFilter.addValue("Nearest", THREE.NearestFilter);
	this.minFilter.addValue("Linear", THREE.LinearFilter);
	this.minFilter.addValue("MIP Nearest Nearest", THREE.NearestMipMapNearestFilter);
	this.minFilter.addValue("MIP Nearest Linear", THREE.NearestMipMapLinearFilter);
	this.minFilter.addValue("MIP Linear Nearest", THREE.LinearMipMapNearestFilter);
	this.minFilter.addValue("MIP Linear Linear", THREE.LinearMipMapLinearFilter);
	this.minFilter.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.minFilter = self.minFilter.getValue();
			self.updateMaterial();
		}
	});
	this.form.add(this.minFilter);
	this.form.nextRow();

	//Magnification filter
	this.form.addText("Mag. filter");
	this.magFilter = new DropdownList(this.form.element);
	this.magFilter.size.set(150, 18);
	this.magFilter.addValue("Nearest", THREE.NearestFilter);
	this.magFilter.addValue("Linear", THREE.LinearFilter);
	this.magFilter.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.magFilter = self.magFilter.getValue();
			self.updateMaterial();
		}
	});
	this.form.add(this.magFilter);
	this.form.nextRow();

	//Flip Y
	this.form.addText("Flip Y");
	this.flipY = new CheckBox(this.form.element);
	this.flipY.size.set(20, 15);
	this.flipY.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.flipY = self.flipY.getValue();
			self.updateMaterial();
		}
	});
	this.form.add(this.flipY);
	this.form.nextRow();
}

CubeTextureEditor.prototype = Object.create(TabElement.prototype);

//Update test material
CubeTextureEditor.prototype.updateMaterial = function()
{
	this.texture.needsUpdate = true;
	//TODO <ADD CHANGE TO HISTORY>
}

//Check if texture is attached to tab
CubeTextureEditor.prototype.isAttached = function(texture)
{
	return this.texture === texture;
}

//Activate
CubeTextureEditor.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
	
	Mouse.setCanvas(this.canvas.element);
}

//Update object data
CubeTextureEditor.prototype.updateMetadata = function()
{
	if(this.texture !== null)
	{
		//Set name
		if(this.texture.name !== undefined)
		{
			this.setName(this.texture.name);
		}

		//If not found close tab
		if(Editor.program.textures[this.texture.uuid] === undefined)
		{
			this.close();
		}
	}
}

//Attach texure
CubeTextureEditor.prototype.attach = function(texture)
{
	//this.texture = texture;
	this.updateMetadata();

	//Update form
	this.name.setText(texture.name);
	this.magFilter.setValue(texture.magFilter);
	this.minFilter.setValue(texture.minFilter);
	this.flipY.setValue(texture.flipY);
};

//Update
CubeTextureEditor.prototype.update = function()
{
	this.division.update();

	if(Editor.mouse.buttonPressed(Mouse.LEFT))
	{
		var delta = Editor.mouse.delta.x * 0.004;
		this.camera.rotation.y += delta;
	}

	this.renderer.render(this.scene, this.camera);
}

//Update
CubeTextureEditor.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	
	//Dual division
	this.division.visible = this.visible;
	this.division.size.copy(this.size);
	this.division.updateInterface();

	//Canvas
	this.canvas.visible = this.visible;
	this.canvas.size.set(this.division.divA.offsetWidth, this.division.divA.offsetHeight);
	this.canvas.updateInterface();
	
	//Renderer
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.camera.aspect = this.canvas.size.x/this.canvas.size.y;
	this.camera.updateProjectionMatrix();

	//Update form
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
