"use strict";

function MaterialEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Material", Editor.filePath + "icons/misc/material.png");

	//Self pointer
	var self = this;

	//Main container
	this.main = new DualDivisionResizable(this.element);
	this.main.setOnResize(function()
	{
		self.updateInterface();
	});
	this.main.tabPosition = 0.5;
	this.main.tabPositionMin = 0.05;
	this.main.tabPositionMax = 0.95;

	//Preview division
	this.preview = new DualDivisionResizable(this.main.divA);
	this.preview.setOnResize(function()
	{
		self.updateInterface();
	});
	this.preview.orientation = DualDivisionResizable.VERTICAL;
	this.preview.tabPosition = 0.8;
	this.preview.tabPositionMin = 0.3;
	this.preview.tabPositionMax = 0.8;

	//Division style
	this.preview.divA.style.overflow = "hidden";
	this.preview.divA.style.backgroundColor = Editor.theme.panelColor;
	this.main.divB.style.overflow = "auto";
	this.main.divB.style.backgroundColor = Editor.theme.panelColor;
	this.preview.divB.style.overflow = "auto";

	//Canvas
	this.canvas = new Canvas(this.preview.divA);

	//Children
	this.children = [];

	//Material and corresponding asset
	this.material = null;
	this.asset = null;

	//Renderer
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = Settings.render.shadows;
	this.renderer.shadowMap.type = Settings.render.shadowsType;

	//Camera
	this.camera = new THREE.PerspectiveCamera(80, this.canvas.size.x/this.canvas.size.y);

	//Preview scene
	this.scene = new THREE.Scene();
	this.sky = new Sky();
	this.scene.add(this.sky);
	this.pointLight = new PointLight(0x777777);
	this.scene.add(this.pointLight);
	this.ambientLight = new AmbientLight(0x555555);
	this.scene.add(this.ambientLight);

	this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 64, 64), null);
	this.mesh.position.set(0, 0, -2.5);
	this.mesh.visible = false;
	this.scene.add(this.mesh);
	
	this.sprite = new THREE.Sprite(null);
	this.sprite.position.set(0, 0, -1.5);
	this.sprite.visible = false;
	this.scene.add(this.sprite);

	//Preview configuration
	this.previewForm = new Form(this.preview.divB);
	this.previewForm.position.set(10, 5);
	this.previewForm.spacing.set(5, 5);
	this.previewForm.addText("Configuration");
	this.previewForm.nextRow();

	//Test model
	this.previewForm.addText("Test Model");
	this.testModel = new DropdownList(this.previewForm.element);
	this.testModel.size.set(100, 18);
	this.testModel.addValue("Sphere", 0);
	this.testModel.addValue("Torus", 1);
	this.testModel.addValue("Cube", 2);
	this.testModel.addValue("Torus Knot", 3);
	this.testModel.setOnChange(function()
	{
		var value = self.testModel.getSelectedIndex();

		//Sphere
		if(value === 0)
		{
			self.mesh.geometry = new THREE.SphereBufferGeometry(1, 64, 64);
		}
		//Torus
		else if(value === 1)
		{
			self.mesh.geometry = new THREE.TorusBufferGeometry(0.8, 0.4, 32, 64);
		}
		//Cube
		else if(value === 2)
		{
			self.mesh.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 32, 32, 32);
		}
		//Torus Knot
		else if(value === 3)
		{
			self.mesh.geometry = new THREE.TorusKnotBufferGeometry(0.7, 0.3, 128, 64);
		}
	});
	this.previewForm.add(this.testModel);
	this.previewForm.nextRow();

	//Sky
	this.previewForm.addText("Sky");
	this.skyEnabled = new CheckBox(this.previewForm.element);
	this.skyEnabled.size.set(15, 15);
	this.skyEnabled.setValue(true);
	this.skyEnabled.setOnChange(function()
	{
		self.sky.visible = self.skyEnabled.getValue();
	});
	this.previewForm.add(this.skyEnabled);
	this.previewForm.nextRow();

	//Point Light
	this.previewForm.addText("Point Light");
	this.lightEnabled = new CheckBox(this.previewForm.element);
	this.lightEnabled.size.set(15, 15);
	this.lightEnabled.setValue(true);
	this.lightEnabled.setOnChange(function()
	{
		self.pointLight.visible = self.lightEnabled.getValue();
	});
	this.previewForm.add(this.lightEnabled);

	//Form
	this.form = new Form(this.main.divB);
	this.form.position.set(10, 5);
	this.form.spacing.set(5, 5);
	this.form.defaultTextWidth = 100;

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form.element);
	this.name.size.set(200, 18);
	this.name.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.name = self.name.getText();
			Editor.updateObjectViews();
		}
	});
	this.form.add(this.name);
	this.form.nextRow();

	//Side
	this.form.addText("Side");
	this.side = new DropdownList(this.form.element);
	this.side.position.set(100, 85);
	this.side.size.set(100, 18);
	this.side.addValue("Front", THREE.FrontSide);
	this.side.addValue("Back", THREE.BackSide);
	this.side.addValue("Double", THREE.DoubleSide);
	this.side.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.side = self.side.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.side);
	this.form.nextRow();

	//Test depth
	this.form.addText("Depth");
	this.depthTest = new CheckBox(this.form.element);
	this.form.addText("Test", true);
	this.depthTest.size.set(15, 15);
	this.depthTest.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.depthTest = self.depthTest.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.depthTest);

	//Write depth
	this.depthWrite = new CheckBox(this.form.element);
	this.form.addText("Write", true);
	this.depthWrite.size.set(15, 15);
	this.depthWrite.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.depthWrite  = self.depthWrite .getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.depthWrite );
	this.form.nextRow();

	//Transparent
	this.form.addText("Transparent");
	this.transparent = new CheckBox(this.form.element);
	this.transparent.size.set(15, 15);
	this.transparent.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.transparent = self.transparent.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.transparent);
	this.form.nextRow();

	//Opacity level
	this.form.addText("Opacity");
	this.opacity = new Slider(this.form.element);
	this.opacity.size.set(160, 18);
	this.opacity.setRange(0, 1);
	this.opacity.setStep(0.01);
	this.opacity.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.opacity = self.opacity.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.opacity);
	this.form.nextRow();
	
	//Alpha test
	this.form.addText("Alpha test");
	this.alphaTest = new Slider(this.form.element);
	this.alphaTest.size.set(160, 18);
	this.alphaTest.setRange(0, 1);
	this.alphaTest.setStep(0.01);
	this.alphaTest.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.alphaTest = self.alphaTest.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.alphaTest);
	this.form.nextRow();
	
	//Blending mode
	this.form.addText("Blending Mode");
	this.blending = new DropdownList(this.form.element);
	this.blending.position.set(100, 85);
	this.blending.size.set(100, 18);
	this.blending.addValue("None", THREE.NoBlending);
	this.blending.addValue("Normal", THREE.NormalBlending);
	this.blending.addValue("Additive", THREE.AdditiveBlending);
	this.blending.addValue("Subtractive", THREE.SubtractiveBlending);
	this.blending.addValue("Multiply", THREE.MultiplyBlending);
	this.blending.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.blending = self.blending.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.blending);
	this.form.nextRow();
}

MaterialEditor.prototype = Object.create(TabElement.prototype);

//Attach material to material editor
MaterialEditor.prototype.attach = function(material, asset)
{
	//Check is if sprite material and ajust preview
	if(material instanceof THREE.SpriteMaterial)
	{
		this.sprite.material = material;
		this.sprite.visible = true;
		this.mesh.visible = false;
	}
	else
	{
		this.mesh.material = material;
		this.mesh.visible = true;
		this.sprite.visible = false;
	}

	//Material asset
	if(asset !== undefined)
	{
		this.asset = asset;
	}
	
	//Store material
	this.material = material;
	this.updateMetadata();

	//Generic material elements
	this.name.setText(material.name);
	this.side.setValue(material.side);
	this.depthTest.setValue(material.depthTest);
	this.depthWrite.setValue(material.depthWrite);
	this.transparent.setValue(material.transparent);
	this.opacity.setValue(material.opacity);
	this.alphaTest.setValue(material.alphaTest);
	this.blending.setValue(material.blending);
};

//Check if material is attached to tab
MaterialEditor.prototype.isAttached = function(material)
{
	return this.material === material;
};

//Activate
MaterialEditor.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);
	
	Editor.mouse.setCanvas(this.canvas.element);
};

//Update object data
MaterialEditor.prototype.updateMetadata = function()
{
	if(this.material !== null)
	{
		//Set name
		if(this.material.name !== undefined)
		{
			this.setName(this.material.name);
		}

		//If not found close tab
		if(Editor.program.materials[this.material.uuid] === undefined)
		{
			this.close();
		}
	}
};

//Update material editor
MaterialEditor.prototype.update = function()
{
	//Render Material
	if(this.material !== null)
	{
		//If needs update file metadata
		if(this.material.needsUpdate)
		{
			Editor.updateAssetExplorer();
			this.material.needsUpdate = true;
		}

		//Render scene
		this.renderer.render(this.scene, this.camera);
	}

	//Move material view
	if(Editor.mouse.insideCanvas())
	{
		//Rotate object
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new THREE.Quaternion();
			delta.setFromEuler(new THREE.Euler(Editor.mouse.delta.y * 0.005, Editor.mouse.delta.x * 0.005, 0, 'XYZ'));
			this.mesh.quaternion.multiplyQuaternions(delta, this.mesh.quaternion);
		}

		//Zoom
		this.camera.position.z += Editor.mouse.wheel * 0.003;
		if(this.camera.position.z > 5)
		{
			this.camera.position.z = 5;
		}
		else if(this.camera.position.z < -1.5)
		{
			this.camera.position.z = -1.5;
		}
	}
};

//Update elements
MaterialEditor.prototype.updateInterface = function()
{	
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Main
		this.main.visible = this.visible;
		this.main.size.copy(this.size);
		this.main.updateInterface();

		//Preview
		this.preview.visible = this.visible;
		this.preview.size.set(this.size.x * this.main.tabPosition, this.size.y);
		this.preview.updateInterface();

		//Canvas
		this.canvas.visible = this.visible;
		this.canvas.size.set(this.preview.divA.offsetWidth, this.preview.divA.offsetHeight);
		this.canvas.updateInterface();

		//Renderer and canvas
		this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
		this.camera.aspect = this.canvas.size.x/this.canvas.size.y;
		this.camera.updateProjectionMatrix();

		//Preview form
		this.previewForm.visible = this.visible;
		this.previewForm.updateInterface();

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
};
