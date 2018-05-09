"use strict";

function MaterialEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Material", Editor.filePath + "icons/misc/material.png");

	//Self pointer
	var self = this;

	//Main container
	this.main = new DualDivision(this.element);
	this.main.setOnResize(function()
	{
		self.updateInterface();
	});
	this.main.tabPosition = 0.5;
	this.main.tabPositionMin = 0.05;
	this.main.tabPositionMax = 0.95;

	//Preview division
	this.preview = new DualDivision(this.main.divA);
	this.preview.setOnResize(function()
	{
		self.updateInterface();
	});
	this.preview.orientation = DualDivision.VERTICAL;
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
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Editor.settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = Editor.settings.render.shadows;
	this.renderer.shadowMap.type = Editor.settings.render.shadowsType;

	//Preview scene
	this.scene = new THREE.Scene();
	
	//Camera
	this.camera = new THREE.PerspectiveCamera(80, this.canvas.size.x / this.canvas.size.y);
	this.camera.position.set(0, 0, 2.5);

	//Interactive object
	this.interactive = new THREE.Object3D();
	this.scene.add(this.interactive);

	//Preview configuration
	this.previewForm = new Form(this.preview.divB);
	this.previewForm.position.set(10, 5);
	this.previewForm.spacing.set(5, 5);

	//Configuration text
	this.previewForm.addText("Configuration");
	this.previewForm.nextRow();

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
		Editor.history.add(new ChangeAction(self.material, "name", self.name.getText()));
		Editor.updateObjectsViewsGUI();
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
		Editor.history.add(new ChangeAction(self.material, "side", self.side.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.side);
	this.form.nextRow();

	//Test depth
	this.form.addText("Depth Test");
	this.depthTest = new CheckBox(this.form.element);
	this.depthTest.size.set(15, 15);
	this.depthTest.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "depthTest", self.depthTest.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthTest);
	this.form.nextRow();
	
	//Write depth
	this.form.addText("Depth Write");
	this.depthWrite = new CheckBox(this.form.element);
	this.depthWrite.size.set(15, 15);
	this.depthWrite.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "depthWrite", self.depthWrite.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthWrite);
	this.form.nextRow();

	//Depth mode
	this.form.addText("Depth Mode");
	this.depthFunc = new DropdownList(this.form.element);
	this.depthFunc.position.set(100, 85);
	this.depthFunc.size.set(100, 18);
	this.depthFunc.addValue("Never", THREE.NeverDepth);
	this.depthFunc.addValue("Always", THREE.AlwaysDepth);
	this.depthFunc.addValue("Less", THREE.LessDepth);
	this.depthFunc.addValue("Less or equal", THREE.LessEqualDepth);
	this.depthFunc.addValue("Greater or equal", THREE.GreaterEqualDepth);
	this.depthFunc.addValue("Greater", THREE.GreaterDepth);
	this.depthFunc.addValue("Not equal", THREE.NotEqualDepth);
	this.depthFunc.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "depthFunc", self.depthFunc.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthFunc);
	this.form.nextRow();

	//Transparent
	this.form.addText("Transparent");
	this.transparent = new CheckBox(this.form.element);
	this.transparent.size.set(15, 15);
	this.transparent.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "transparent", self.transparent.getValue()));
		self.material.needsUpdate = true;
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
		Editor.history.add(new ChangeAction(self.material, "opacity", self.opacity.getValue()));
		self.material.needsUpdate = true;
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
		Editor.history.add(new ChangeAction(self.material, "alphaTest", self.alphaTest.getValue()));
		self.material.needsUpdate = true;
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
		Editor.history.add(new ChangeAction(self.material, "blending", self.blending.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.blending);
	this.form.nextRow();
}

MaterialEditor.geometries = [
	["Sphere", new THREE.SphereBufferGeometry(1, 32, 32)],
	["Torus", new THREE.TorusBufferGeometry(0.8, 0.4, 32, 64)],
	["Cube", new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1)],
	["Torus Knot", new THREE.TorusKnotBufferGeometry(0.7, 0.3, 128, 64)],
	["Cone", new THREE.ConeBufferGeometry(1, 2, 32)],
	["Sphere HiPoly", new THREE.SphereBufferGeometry(1, 64, 64)],
	["Cube HiPoly", new THREE.BoxBufferGeometry(1, 1, 1, 128, 128, 128)]
];

MaterialEditor.prototype = Object.create(TabElement.prototype);

//Attach material to material editor
MaterialEditor.prototype.attach = function(material, asset)
{
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
	this.depthFunc.setValue(material.depthFunc);
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

//Destroy
MaterialEditor.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	if(this.renderer !== null)
	{
		this.renderer.dispose();
		this.renderer.forceContextLoss();
		this.renderer = null;
	}
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
			this.name.setText(this.material.name);
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
			Editor.updateObjectsViewsGUI();
			
			if(this.material.envMap != null)
			{
				this.scene.background = this.material.envMap;
			}
			else
			{
				this.scene.background = null;
			}

			this.material.needsUpdate = true;
		}

		//Render scene
		if(this.renderer !== null)
		{
			this.renderer.render(this.scene, this.camera);
		}
	}

	//Move material view
	if(Editor.mouse.insideCanvas())
	{
		//Zoom
		this.camera.position.z += this.camera.position.z * Editor.mouse.wheel * 0.001;

		//Rotate object
		if(Editor.mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new THREE.Quaternion();
			delta.setFromEuler(new THREE.Euler(Editor.mouse.delta.y * 0.005, Editor.mouse.delta.x * 0.005, 0, 'XYZ'));
			
			this.interactive.quaternion.multiplyQuaternions(delta, this.interactive.quaternion);
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
