"use strict";

function TextureEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Texture", Editor.filePath + "icons/misc/image.png");

	var self = this;

	this.Texture = null;

	//Dual division
	this.division = new DualDivision(this.element);
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
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Editor.settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = false;

	//Camera
	this.camera = new OrthographicCamera(1.2, 1, OrthographicCamera.RESIZE_VERTICAL);

	//Scene
	this.scene = new THREE.Scene();

	//Background
	var alpha = new Texture(Editor.filePath + "alpha.png");
	alpha.wrapS = THREE.RepeatWrapping;
	alpha.wrapT = THREE.RepeatWrapping;
	alpha.magFilter = THREE.Nearest;
	alpha.minFilter = THREE.Nearest;
	alpha.repeat.set(5, 5);

	var geometry = new THREE.PlaneBufferGeometry(1, 1);

	this.background = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: alpha}));
	this.background.position.set(0, 0, -2);
	this.background.scale.set(2.5, 2.5, 0);
	this.scene.add(this.background);
	
	//Plane geometry
	this.sprite = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({transparent: true}));
	this.sprite.position.set(0, 0, -1);
	this.scene.add(this.sprite);

	//Form
	this.form = new Form(this.division.divB);
	this.form.position.set(10, 5);
	this.form.spacing.set(5, 5);

	this.form.addText("Texture Editor");
	this.form.nextRow();

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.texture !== null)
		{
			Editor.history.add(new ChangeAction(self.texture, "name", self.name.getText()));
			self.updatePreview();
			Editor.updateViewsGUI();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//WrapS
	this.form.addText("Wrap Hor.");
	this.wrapS = new DropdownList(this.form.element);
	this.wrapS.size.set(120, 18);
	this.wrapS.addValue("Clamp to Edge", THREE.ClampToEdgeWrapping);
	this.wrapS.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapS.addValue("Repeat Mirrored", THREE.MirroredRepeatWrapping);
	this.wrapS.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.texture, "wrapS", self.wrapS.getValue()));
		self.updatePreview();
	});
	this.form.add(this.wrapS);
	this.form.nextRow();

	//WrapT
	this.form.addText("Wrap Vert.");
	this.wrapT = new DropdownList(this.form.element);
	this.wrapT.size.set(120, 18);
	this.wrapT.addValue("Clamp to Edge", THREE.ClampToEdgeWrapping);
	this.wrapT.addValue("Repeat", THREE.RepeatWrapping);
	this.wrapT.addValue("Repeat Mirrored", THREE.MirroredRepeatWrapping);
	this.wrapT.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.texture, "wrapT", self.wrapT.getValue()));
		self.updatePreview();
	});
	this.form.add(this.wrapT);
	this.form.nextRow();

	//Repeat
	this.form.addText("Repeat");
	this.repeat = new CoordinatesBox(this.form.element);
	this.repeat.setMode(CoordinatesBox.VECTOR2);
	this.repeat.size.set(120, 18);
	this.repeat.setStep(0.01);
	this.repeat.setOnChange(function()
	{
		var value = self.repeat.getValue();
		self.texture.repeat.set(value.x, value.y);
		self.updatePreview();
	});
	this.form.add(this.repeat);
	this.form.nextRow();

	//Offset
	this.form.addText("Offset");
	this.offset = new CoordinatesBox(this.form.element);
	this.offset.setMode(CoordinatesBox.VECTOR2);
	this.offset.size.set(120, 18);
	this.offset.setStep(0.01);
	this.offset.setOnChange(function()
	{
		var value = self.offset.getValue();
		self.texture.offset.set(value.x, value.y);
		self.updatePreview();
	});
	this.form.add(this.offset);
	this.form.nextRow();

	//Center
	this.form.addText("Center");
	this.center = new CoordinatesBox(this.form.element);
	this.center.setMode(CoordinatesBox.VECTOR2);
	this.center.size.set(120, 18);
	this.center.setStep(0.01);
	this.center.setOnChange(function()
	{
		var value = self.center.getValue();
		self.texture.center.set(value.x, value.y);
		self.updatePreview();
	});
	this.form.add(this.center);
	this.form.nextRow();

	//Rotation
	this.form.addText("Rotation");
	this.rotation = new NumberBox(this.form.element);
	this.rotation.size.set(60, 18);
	this.rotation.setStep(0.1);
	this.rotation.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.texture, "rotation", self.rotation.getValue()));
		self.updatePreview();
	});
	this.form.add(this.rotation);
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
		Editor.history.add(new ChangeAction(self.texture, "minFilter", self.minFilter.getValue()));
		self.updatePreview();
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
		Editor.history.add(new ChangeAction(self.texture, "magFilter", self.magFilter.getValue()));
		self.updatePreview();
	});
	this.form.add(this.magFilter);
	this.form.nextRow();

	//Premultiply Alpha
	this.form.addText("Premul. Alpha");
	this.premultiplyAlpha = new CheckBox(this.form.element);
	this.premultiplyAlpha.size.set(15, 15);
	this.premultiplyAlpha.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.texture, "premultiplyAlpha", self.premultiplyAlpha.getValue()));
		self.updatePreview();
	});
	this.form.add(this.premultiplyAlpha);
	this.form.nextRow();

	//Flip Y
	this.form.addText("Flip Y");
	this.flipY = new CheckBox(this.form.element);
	this.flipY.size.set(15, 15);
	this.flipY.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.texture, "flipY", self.flipY.getValue()));
		self.updatePreview();
	});
	this.form.add(this.flipY);
	this.form.nextRow();
}

TextureEditor.prototype = Object.create(TabElement.prototype);

//Activate
TextureEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);
	
	this.updatePreview();

	var texture = this.texture;
	this.name.setText(texture.name);
	this.wrapT.setValue(texture.wrapT);
	this.wrapS.setValue(texture.wrapS);
	this.repeat.setValue(texture.repeat);
	this.offset.setValue(texture.offset);
	this.center.setValue(texture.center);
	this.rotation.setValue(texture.rotation);
	this.magFilter.setValue(texture.magFilter);
	this.minFilter.setValue(texture.minFilter);
	this.premultiplyAlpha.setValue(texture.premultiplyAlpha);
	this.flipY.setValue(texture.flipY);
};

//Destroy
TextureEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer = null;
	}
};

//Update test material
TextureEditor.prototype.updatePreview = function()
{
	this.sprite.material.map.needsUpdate = true;
	this.sprite.material.needsUpdate = true;
}

//Check if texture is attached to tab
TextureEditor.prototype.isAttached = function(texture)
{
	return this.texture === texture;
}

//Update object data
TextureEditor.prototype.updateMetadata = function()
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
}

//Attach texure
TextureEditor.prototype.attach = function(texture)
{
	this.texture = texture;
	this.sprite.material.map = texture;
	
	this.updateMetadata();
	this.updatePreview();
};

//Update
TextureEditor.prototype.update = function()
{
	this.renderer.render(this.scene, this.camera);
}

//Update
TextureEditor.prototype.updateInterface = function()
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
		this.camera.mode = (this.camera.aspect > 1) ? OrthographicCamera.RESIZE_HORIZONTAL : OrthographicCamera.RESIZE_VERTICAL;
		this.camera.updateProjectionMatrix();

		//Form
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
