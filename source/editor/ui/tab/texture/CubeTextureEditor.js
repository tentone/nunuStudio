"use strict";

function CubeTextureEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Texture", "editor/files/icons/misc/cube.png");

	var self = this;

	this.texture = null;

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

	//Texture
	this.texture = null;

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

	//Mapping
	this.form.addText("Mapping");
	this.mapping = new DropdownList(this.form.element);
	this.mapping.size.set(150, 18);
	this.mapping.addValue("Reflection Mapping", THREE.CubeReflectionMapping);
	this.mapping.addValue("Refraction Mapping", THREE.CubeRefractionMapping);
	this.mapping.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.mapping = self.mapping.getValue();
			self.updateMaterial();
		}
	});
	this.form.add(this.mapping);
	this.form.nextRow();

	//Size
	this.form.addText("Size");
	this.textureSize = new DropdownList(this.form.element);
	this.textureSize.size.set(120, 18);
	this.textureSize.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.size = self.textureSize.getValue();
			self.texture.updateImages();
		}
	});
	this.form.add(this.textureSize);
	this.form.nextRow();

	//Size options
	for(var i = 5; i < 12; i++)
	{
		var size = Math.pow(2, i);
		this.textureSize.addValue(size + "x" + size, size);
	}

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

	//Cube texture
	this.form.addText("Cube texture");
	this.form.nextRow();

	this.images = [];
	
	//Spacer
	this.form.addDivision(100, 100);

	//Top
	this.top = new ImageChooser(this.form.element);
	this.top.size.set(100, 100);
	this.top.setOnChange(function()
	{
		if(self.texture !== null)
		{
			var image = new Image(self.top.getValue());
			self.texture.images[CubeTexture.TOP] = image;
			self.texture.updateImages();
		}
	});
	this.form.add(this.top);
	this.form.nextRow();

	//Left
	this.left = new ImageChooser(this.form.element);
	this.left.size.set(100, 100);
	this.left.setOnChange(function()
	{
		if(self.texture !== null)
		{
			var image = new Image(self.left.getValue());
			self.texture.images[CubeTexture.LEFT] = image;
			self.texture.updateImages();
		}
	});
	this.form.add(this.left);

	//Front
	this.front = new ImageChooser(this.form.element);
	this.front.size.set(100, 100);
	this.front.setOnChange(function()
	{
		if(self.texture !== null)
		{
			var image = new Image(self.front.getValue());
			self.texture.images[CubeTexture.FRONT] = image;
			self.texture.updateImages();
		}
	});
	this.form.add(this.front);

	//Right
	this.right = new ImageChooser(this.form.element);
	this.right.size.set(100, 100);
	this.right.setOnChange(function()
	{
		if(self.texture !== null)
		{
			var image = new Image(self.right.getValue());
			self.texture.images[CubeTexture.RIGHT] = image;
			self.texture.updateImages();
		}
	});
	this.form.add(this.right);

	//Back
	this.back = new ImageChooser(this.form.element);
	this.back.size.set(100, 100);
	this.back.setOnChange(function()
	{
		if(self.texture !== null)
		{
			var image = new Image(self.back.getValue());
			self.texture.images[CubeTexture.BACK] = image;
			self.texture.updateImages();
		}
	});
	this.form.add(this.back);
	this.form.nextRow();

	//Spacer
	this.form.addDivision(100, 100);

	//Bottom
	this.bottom = new ImageChooser(this.form.element);
	this.bottom.size.set(100, 100);
	this.bottom.setOnChange(function()
	{
		if(self.texture !== null)
		{
			var image = new Image(self.bottom.getValue());
			self.texture.images[CubeTexture.BOTTOM] = image;
			self.texture.updateImages();
		}
	});
	this.form.add(this.bottom);
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
	this.active = true;
	
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
	
	Mouse.setCanvas(this.canvas.element);

	this.attach(this.texture);
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
	this.texture = texture;
	this.updateMetadata();

	this.scene.background = texture;

	//Update form
	this.name.setText(texture.name);
	this.magFilter.setValue(texture.magFilter);
	this.minFilter.setValue(texture.minFilter);
	this.mapping.setValue(texture.mapping);
	this.textureSize.setValue(texture.size);
	this.flipY.setValue(texture.flipY);

	this.top.setValue(texture.images[CubeTexture.TOP].data);
	this.bottom.setValue(texture.images[CubeTexture.BOTTOM].data);
	this.left.setValue(texture.images[CubeTexture.LEFT].data);
	this.right.setValue(texture.images[CubeTexture.RIGHT].data);
	this.front.setValue(texture.images[CubeTexture.FRONT].data);
	this.back.setValue(texture.images[CubeTexture.BACK].data);
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
		this.element.style.display = "block";
	
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
	else
	{
		this.element.style.display = "none";
	}
}
