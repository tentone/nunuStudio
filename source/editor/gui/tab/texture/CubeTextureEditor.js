"use strict";

function CubeTextureEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Texture", Global.FILE_PATH + "icons/misc/cube.png");

	var self = this;

	this.texture = null;

	//Canvas
	this.canvas = new RendererCanvas();
	this.canvas.setOnResize(function(x, y)
	{
		self.camera.aspect = x / y;
		self.camera.updateProjectionMatrix();
	});

	//Mouse
	this.mouse = new Mouse(window, true);
	this.mouse.setCanvas(this.canvas.element);

	//Camera
	this.camera = new PerspectiveCamera(100, this.canvas.width/this.canvas.height);

	//Scene
	this.scene = new THREE.Scene();

	//Texture
	this.texture = null;

	//Form
	this.form = new TableForm();
	this.form.setAutoSize(false);
	this.form.addText("Cube Texture Editor");
	this.form.nextRow();

	//Dual division
	this.division = new DualContainer(this);
	this.division = new DualContainer(this);
	this.division.tabPosition = 0.5;
	this.division.tabPositionMin = 0.1;
	this.division.tabPositionMax = 0.9;
	this.division.attachA(this.canvas);
	this.division.attachB(this.form);

	//Name
	this.form.addText(Locale.name);
	this.name = new TextBox(this.form);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.texture !== null)
		{
			self.texture.name = self.name.getText();
			self.updateMaterial();
			Editor.updateObjectsViewsGUI();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Minification filter
	this.form.addText(Locale.minFilter);
	this.minFilter = new DropdownList(this.form);
	this.minFilter.size.set(150, 18);
	this.minFilter.addValue(Locale.nearest, THREE.NearestFilter);
	this.minFilter.addValue(Locale.linear, THREE.LinearFilter);
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
	this.form.addText(Locale.magFilter);
	this.magFilter = new DropdownList(this.form);
	this.magFilter.size.set(150, 18);
	this.magFilter.addValue(Locale.nearest, THREE.NearestFilter);
	this.magFilter.addValue(Locale.linear, THREE.LinearFilter);
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
	this.form.addText(Locale.mapping);
	this.mapping = new DropdownList(this.form);
	this.mapping.size.set(150, 18);
	this.mapping.addValue("Reflection Mapping", THREE.CubeReflectionMapping);
	this.mapping.addValue("Refraction Mapping", THREE.CubeRefractionMapping);
	this.mapping.setOnChange(function()
	{
		self.texture.mapping = self.mapping.getValue();
		self.updateMaterial();
	});
	this.form.add(this.mapping);
	this.form.nextRow();

	//Size
	this.form.addText(Locale.size);
	this.textureSize = new DropdownList(this.form);
	this.textureSize.size.set(120, 18);
	this.textureSize.setOnChange(function()
	{
		self.texture.size = self.textureSize.getValue();
		self.texture.updateImages();
	});
	this.form.add(this.textureSize);
	this.form.nextRow();

	//Size options
	for(var i = 2; i < 12; i++)
	{
		var size = Math.pow(2, i);
		this.textureSize.addValue(size + "x" + size, size);
	}

	//Mode
	this.form.addText(Locale.mode);
	this.mode = new DropdownList(this.form);
	this.mode.size.set(120, 18);
	this.mode.setOnChange(function()
	{
		self.texture.mode = self.mode.getValue();
		self.texture.updateImages();
		self.updateMode();
		Editor.updateObjectsViewsGUI();
	});
	this.mode.addValue(Locale.cube, CubeTexture.CUBE);
	this.mode.addValue("Cross", CubeTexture.CROSS);
	this.mode.addValue("Equirectangular", CubeTexture.EQUIRECTANGULAR);
	this.form.add(this.mode);
	this.form.nextRow();

	//Flip Y
	this.form.addText(Locale.flipY);
	this.flipY = new CheckBox(this.form);
	this.flipY.size.set(18, 18);
	this.flipY.setOnChange(function()
	{
		self.texture.flipY = self.flipY.getValue();
		self.updateMaterial();
	});
	this.form.add(this.flipY);
	this.form.nextRow();

	//Cube texture
	this.form.addText("Cube texture");
	this.form.nextRow();

	//Cube images
	this.images = new Division(this.form);
	this.images.size.set(400, 300);
	this.form.add(this.images);
	this.form.nextRow();

	//Image
	this.image = new ImageChooser(this.images);
	this.image.position.set(0, 0);
	this.image.size.set(400, 200);
	this.image.setOnChange(function()
	{
		var image = self.image.getValue();
		self.texture.images[0] = image;
		self.texture.updateImages();
		Editor.updateObjectsViewsGUI();
	});
	this.image.updateInterface();

	//Cube faces
	this.cube = [];

	//Top
	this.top = new ImageChooser(this.images);
	this.top.position.set(100, 0);
	this.top.size.set(100, 100);
	this.top.setOnChange(function()
	{
		var image = self.top.getValue();
		self.texture.images[CubeTexture.TOP] = image;
		self.texture.updateImages();
		Editor.updateObjectsViewsGUI();
	});
	this.cube.push(this.top);

	//Left
	this.left = new ImageChooser(this.images);
	this.left.size.set(100, 100);
	this.left.position.set(0, 100);
	this.left.setOnChange(function()
	{
		var image = self.left.getValue();
		self.texture.images[CubeTexture.LEFT] = image;
		self.texture.updateImages();
		Editor.updateObjectsViewsGUI();
	});
	this.cube.push(this.left);

	//Front
	this.front = new ImageChooser(this.images);
	this.front.size.set(100, 100);
	this.front.position.set(100, 100);
	this.front.setOnChange(function()
	{
		var image = self.front.getValue();
		self.texture.images[CubeTexture.FRONT] = image;
		self.texture.updateImages();
		Editor.updateObjectsViewsGUI();
	});
	this.cube.push(this.front);

	//Right
	this.right = new ImageChooser(this.images);
	this.right.size.set(100, 100);
	this.right.position.set(200, 100);
	this.right.setOnChange(function()
	{
		var image = self.right.getValue();
		self.texture.images[CubeTexture.RIGHT] = image;
		self.texture.updateImages();
		Editor.updateObjectsViewsGUI();
	});
	this.cube.push(this.right);

	//Back
	this.back = new ImageChooser(this.images);
	this.back.size.set(100, 100);
	this.back.position.set(300, 100);
	this.back.setOnChange(function()
	{
		var image = self.back.getValue();
		self.texture.images[CubeTexture.BACK] = image;
		self.texture.updateImages();
		Editor.updateObjectsViewsGUI();
	});
	this.cube.push(this.back);

	//Bottom
	this.bottom = new ImageChooser(this.images);
	this.bottom.position.set(100, 200);
	this.bottom.size.set(100, 100);
	this.bottom.setOnChange(function()
	{
		var image = self.bottom.getValue();
		self.texture.images[CubeTexture.BOTTOM] = image;
		self.texture.updateImages();
		Editor.updateObjectsViewsGUI();
	});
	this.cube.push(this.bottom);
}

CubeTextureEditor.prototype = Object.create(TabElement.prototype);

//Update test material
CubeTextureEditor.prototype.updateMaterial = function()
{
	this.texture.needsUpdate = true;
	
	//TODO <ADD CHANGE TO HISTORY>
};

//Update input elements
CubeTextureEditor.prototype.updateMode = function()
{
	var mode = this.mode.getValue();

	if(mode === CubeTexture.CUBE)
	{
		this.image.visible = false;

		for(var i = 0; i < this.cube.length; i++)
		{
			this.cube[i].visible = true;
			this.cube[i].updateInterface();
		}
	}
	else
	{
		this.image.visible = true;
	
		for(var i = 0; i < this.cube.length; i++)
		{
			this.cube[i].visible = false;
			this.cube[i].updateInterface();
		}

		if(mode === CubeTexture.CROSS)
		{
			this.image.size.set(400, 300);
		}
		else
		{
			this.image.size.set(400, 200);
		}
	}

	this.image.updateInterface();
};

CubeTextureEditor.prototype.isAttached = function(texture)
{
	return this.texture === texture;
};

CubeTextureEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	this.mouse.create();
};

CubeTextureEditor.prototype.deactivate = function()
{
	TabElement.prototype.deactivate.call(this);
	
	this.mouse.dispose();
};

CubeTextureEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	this.mouse.dispose();
	this.canvas.destroy();
};

CubeTextureEditor.prototype.updateMetadata = function()
{
	if(this.texture !== null)
	{
		//Set name
		if(this.texture.name !== undefined)
		{
			this.setName(this.texture.name);
			this.name.setText(this.texture.name);
		}

		//If not found close tab
		if(Editor.program.textures[this.texture.uuid] === undefined)
		{
			this.close();
		}
	}
};

CubeTextureEditor.prototype.attach = function(texture)
{
	this.texture = texture;
	this.updateMetadata();

	this.scene.background = texture;

	this.name.setText(texture.name);
	this.magFilter.setValue(texture.magFilter);
	this.minFilter.setValue(texture.minFilter);
	this.mapping.setValue(texture.mapping);
	this.textureSize.setValue(texture.size);
	this.mode.setValue(texture.mode);
	this.flipY.setValue(texture.flipY);

	if(texture.mode === CubeTexture.CROSS || texture.mode === CubeTexture.EQUIRECTANGULAR)
	{
		this.image.setValue(texture.images[0]);
	}
	else
	{
		this.top.setValue(texture.images[CubeTexture.TOP]);
		this.bottom.setValue(texture.images[CubeTexture.BOTTOM]);
		this.left.setValue(texture.images[CubeTexture.LEFT]);
		this.right.setValue(texture.images[CubeTexture.RIGHT]);
		this.front.setValue(texture.images[CubeTexture.FRONT]);
		this.back.setValue(texture.images[CubeTexture.BACK]);
	}

	this.updateMode();
};

CubeTextureEditor.prototype.update = function()
{
	this.mouse.update();
	
	if(this.mouse.buttonPressed(Mouse.LEFT))
	{
		this.camera.rotation.y += this.mouse.delta.x * 0.004;
	}

	this.canvas.renderer.render(this.scene, this.camera);
};

CubeTextureEditor.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.division.size.copy(this.size);
	this.division.updateInterface();
};
