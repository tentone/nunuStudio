"use strict";

function ShaderMaterialEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Material", Editor.filePath + "icons/misc/material.png");

	//Self pointer
	var self = this;

	//Main container
	this.main = new DualDivision(this);
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
	this.preview.tabPositionMin = 0.05;
	this.preview.tabPositionMax = 0.95;

	//Division style
	this.preview.divA.element.style.overflow = "hidden";
	this.preview.divA.element.style.backgroundColor = Editor.theme.panelColor;
	this.main.divB.element.style.overflow = "auto";
	this.main.divB.element.style.backgroundColor = Editor.theme.panelColor;
	this.preview.divB.element.style.overflow = "auto";

	//Canvas
	this.canvas = new RendererCanvas(this.preview.divA);
	this.canvas.setOnResize(function(x, y)
	{
		self.camera.aspect = x / y;
		self.camera.updateProjectionMatrix();
	});

	//Material UI File element
	this.asset = null;

	//Attached material
	this.material = null;

	//Material camera
	this.camera = new THREE.PerspectiveCamera(80, this.canvas.size.x/this.canvas.size.y);
	this.camera.position.set(0, 0, 2.5);
	
	//Scene
	this.scene = new THREE.Scene();
	
	//Interactive object
	this.interactive = new THREE.Object3D();
	this.scene.add(this.interactive);
	
	//Preview scene
	this.sky = new Sky();
	this.sky.visible = false;
	this.scene.add(this.sky);

	this.pointLight = new THREE.PointLight(0x777777);
	this.pointLight.position.set(-3, 0, 3);
	this.pointLight.visible = false;
	this.scene.add(this.pointLight);
	
	this.ambientLight = new THREE.AmbientLight(0x555555);
	this.ambientLight.visible = false;
	this.scene.add(this.ambientLight);
	
	//Preview configuration
	this.previewForm = new Form(this.preview.divB);
	this.previewForm.position.set(10, 5);
	this.previewForm.spacing.set(5, 5);
	this.previewForm.addText("Configuration");
	this.previewForm.nextRow();

	//Mesh
	this.mesh = new THREE.Mesh(MaterialEditor.geometries[0][1], null);
	this.interactive.add(this.mesh);
	
	//Test model
	this.previewForm.addText("Model");
	this.testModel = new DropdownList(this.previewForm.element);
	this.testModel.size.set(100, 18);
	for(var i = 0; i < MaterialEditor.geometries.length; i++)
	{
		this.testModel.addValue(MaterialEditor.geometries[i][0], i);
	}
	this.testModel.setOnChange(function()
	{
		var value = self.testModel.getSelectedIndex();
		self.mesh.geometry = MaterialEditor.geometries[value][1];
	});
	this.previewForm.add(this.testModel);
	this.previewForm.nextRow();

	//Sky
	this.previewForm.addText("Sky");
	this.skyEnabled = new CheckBox(this.previewForm.element);
	this.skyEnabled.size.set(15, 15);
	this.skyEnabled.setValue(this.sky.visible);
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
	this.lightEnabled.setValue(this.pointLight.visible);
	this.lightEnabled.setOnChange(function()
	{
		self.pointLight.visible = self.lightEnabled.getValue();
	});
	this.previewForm.add(this.lightEnabled);
	this.previewForm.nextRow();

	//Ambient Light
	this.previewForm.addText("Ambient Light");
	this.ambientLightEnabled = new CheckBox(this.previewForm.element);
	this.ambientLightEnabled.size.set(15, 15);
	this.ambientLightEnabled.setValue(this.ambientLight.visible);
	this.ambientLightEnabled.setOnChange(function()
	{
		self.ambientLight.visible = self.ambientLightEnabled.getValue();
	});
	this.previewForm.add(this.ambientLightEnabled);
	this.previewForm.nextRow();

	//Tab container
	this.tab = new TabGroup(this.main.divB);
	this.tab.element.style.backgroundColor = Editor.theme.barColor;
	this.tab.buttonSize.set(150, 25);

	//General
	this.general = this.tab.addTab(TabElement, false);
	this.general.setIcon(Editor.filePath + "icons/misc/material.png");
	this.general.setName("Material");

	//Form
	this.form = new Form(this.general.element);
	this.form.position.set(10, 5);
	this.form.spacing.set(5, 5);

	//Name
	this.form.addText("Name");
	this.name = new TextBox(this.form);
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
	this.side = new DropdownList(this.form);
	this.side.position.set(100, 85);
	this.side.size.set(150, 18);
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
	this.depthTest = new CheckBox(this.form);
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
	this.depthWrite = new CheckBox(this.form);
	this.depthWrite.size.set(15, 15);
	this.depthWrite.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "depthWrite", self.depthWrite.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.depthWrite );
	this.form.nextRow();

	//Transparent
	this.form.addText("Transparent");
	this.transparent = new CheckBox(this.form);
	this.transparent.size.set(15, 15);
	this.transparent.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "transparent", self.transparent.getValue()));
		self.material.needsUpdate = true;
	});
	this.form.add(this.transparent);
	this.form.nextRow();
	
	//Blending mode
	this.form.addText("Blending Mode");
	this.blending = new DropdownList(this.form);
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

	//Wireframe
	this.form.addText("Wireframe");
	this.wireframe = new CheckBox(this.form);
	this.wireframe.size.set(15, 15);
	this.wireframe.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "wireframe", self.wireframe.getValue()));
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	//Fragment tab
	this.fragmentTab = this.tab.addTab(TabElement, false); 
	this.fragmentTab.setIcon(Editor.filePath + "icons/misc/code.png");
	this.fragmentTab.setName("Fragment");

	//Fragment editor
	this.fragmentShader = new CodeEditor(this.fragmentTab.element);
	this.fragmentShader.setMode("glsl");
	this.fragmentShader.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "fragmentShader", self.fragmentShader.getText()));
		self.material.needsUpdate = true;
	});

	//Vertex tab
	this.vertexTab = this.tab.addTab(TabElement, false);
	this.vertexTab.setIcon(Editor.filePath + "icons/misc/code.png");
	this.vertexTab.setName("Vertex");

	//Vertex editor
	this.vertexShader = new CodeEditor(this.vertexTab.element);
	this.vertexShader.setMode("glsl");
	this.vertexShader.setOnChange(function()
	{
		Editor.history.add(new ChangeAction(self.material, "vertexShader", self.vertexShader.getText()));
		self.material.needsUpdate = true;
	});
}

ShaderMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

ShaderMaterialEditor.prototype.attach = function(material, asset)
{
	//Attach Material
	this.mesh.material = material;

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
	this.blending.setValue(material.blending);	
	this.wireframe.setValue(material.wireframe);
	this.fragmentShader.setText(material.fragmentShader);
	this.vertexShader.setText(material.vertexShader);
};

ShaderMaterialEditor.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	//Main
	this.main.size.copy(this.size);
	this.main.updateInterface();

	//Preview
	this.preview.size.set(this.size.x * this.main.tabPosition, this.size.y);
	this.preview.updateInterface();

	//Canvas
	this.canvas.size.copy(this.preview.divA.size);
	this.canvas.updateInterface();

	//Tab size
	this.tab.size.set(this.size.x - this.canvas.size.x - 5, this.size.y);
	this.tab.updateInterface();

	//Preview form
	this.previewForm.updateInterface();

	//Form
	this.form.updateInterface();

	//Fragment editor
	this.fragmentShader.size.copy(this.tab.size);
	this.fragmentShader.updateSettings();
	this.fragmentShader.updateInterface();

	//Vertex editor
	this.vertexShader.size.copy(this.tab.size);
	this.vertexShader.updateSettings();
	this.vertexShader.updateInterface();
};