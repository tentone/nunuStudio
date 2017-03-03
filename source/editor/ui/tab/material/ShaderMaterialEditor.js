"use strict";

function ShaderMaterialEditor(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Material", "editor/files/icons/misc/material.png");

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

	//Change preview division style
	this.preview.divA.style.overflow = "hidden";
	this.preview.divA.style.backgroundColor = Editor.theme.panelColor;

	//Change main division style
	this.main.divB.style.backgroundColor = Editor.theme.panelColor;

	//Material preview
	//Canvas
	this.canvas = new Canvas(this.preview.divA);

	//Element atributes
	this.children = [];
	
	//Material UI File element
	this.asset = null;

	//Attached material
	this.material = null;

	//Material renderer and scene
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.render.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = Settings.render.shadows;
	this.renderer.shadowMap.type = Settings.render.shadowsType;

	//Material camera
	this.camera = new THREE.PerspectiveCamera(90, this.canvas.size.x/this.canvas.size.y);

	//Material preview scene
	this.scene = new THREE.Scene();
	this.sky = new Sky();
	var sun = this.sky.sun;
	sun.shadow.camera.left = -5;
	sun.shadow.camera.right = 5;
	sun.shadow.camera.top = 5;
	sun.shadow.camera.bottom = -5;
	this.scene.add(this.sky);
	this.scene.add(new PointLight(0x666666));
	this.scene.add(new AmbientLight(0x555555));

	this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(1, 64, 64), null);
	this.mesh.position.set(0, 0, -2.5);
	this.mesh.visible = false;
	this.scene.add(this.mesh);
	
	this.sprite = new THREE.Sprite(null);
	this.sprite.position.set(0, 0, -1.5);
	this.sprite.visible = false;
	this.scene.add(this.sprite);

	//Material preview configuration
	//Text
	var text = new Text(this.preview.divB);
	text.setAlignment(Text.LEFT);
	text.setText("Configuration");
	text.position.set(10, 20);
	text.fitContent = true;
	text.updateInterface();
	this.children.push(text);

	//Test model
	var text = new Text(this.preview.divB);
	text.setAlignment(Text.LEFT);
	text.setText("Test Model");
	text.position.set(10, 45);
	text.fitContent = true;
	text.updateInterface();
	this.children.push(text);

	this.testModel = new DropdownList(this.preview.divB);
	this.testModel.position.set(80, 35);
	this.testModel.size.set(150, 18);
	this.testModel.addValue("Sphere", 0);
	this.testModel.addValue("Torus", 1);
	this.testModel.addValue("Cube", 2);
	this.testModel.addValue("Torus Knot", 3);
	this.testModel.updateInterface();
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
			self.mesh.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 64, 64, 64);
		}
		//Torus Knot
		else if(value === 3)
		{
			self.mesh.geometry = new THREE.TorusKnotBufferGeometry(0.7, 0.3, 128, 64);
		}	
	});
	this.children.push(this.testModel);

	//Sky enabled
	this.skyText = new Text(this.preview.divB);
	this.skyText.size.set(0, 20);
	this.skyText.position.set(10, 60);
	this.skyText.setAlignment(Text.LEFT);
	this.skyText.setText("Enable sky");
	this.children.push(this.skyText);

	this.skyEnabled = new CheckBox(this.preview.divB);
	this.skyEnabled.size.set(200, 15);
	this.skyEnabled.position.set(80, 60);
	this.skyEnabled.setValue(true);
	this.skyEnabled.updateInterface();
	this.skyEnabled.setOnChange(function()
	{
		self.sky.visible = self.skyEnabled.getValue();
	});
	this.children.push(this.skyEnabled);

	//Tab container
	this.tab = new TabGroup(this.main.divB);
	this.tab.element.style.backgroundColor = Editor.theme.barColor;
	this.tab.buttonSize.set(150, 25);

	//General
	this.general = this.tab.addTab(TabElement, false);
	this.general.setIcon("editor/files/icons/misc/material.png");
	this.general.setName("Material");

	//Form
	this.form = new Form(this.general.element);
	this.form.position.set(10, 5);
	this.form.spacing.set(5, 5);

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
	this.side.size.set(150, 18);
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
	this.depthTest.size.set(20, 15);
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
	this.depthWrite.size.set(20, 15);
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
	this.transparent = new CheckBox(this.form.element);
	this.form.addText("Transparent");
	this.transparent.size.set(200, 15);
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

	//Wireframe
	this.wireframe = new CheckBox(this.form.element);
	this.form.addText("Wireframe");
	this.wireframe.size.set(200, 15);
	this.wireframe.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.wireframe = self.wireframe.getValue();
		}
	});
	this.form.add(this.wireframe);
	this.form.nextRow();

	//Fragment tab
	this.fragmentTab = this.tab.addTab(TabElement, false); 
	this.fragmentTab.setIcon("editor/files/icons/misc/code.png");
	this.fragmentTab.setName("Fragment");

	//Fragment editor
	this.fragmentShader = new CodeEditor(this.fragmentTab.element);
	this.fragmentShader.setMode("glsl");
	this.fragmentShader.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.fragmentShader = self.fragmentShader.getValue();
			self.material.needsUpdate = true;
		}
	});

	//Vertex tab
	this.vertexTab = this.tab.addTab(TabElement, false);
	this.vertexTab.setIcon("editor/files/icons/misc/code.png");
	this.vertexTab.setName("Vertex");

	//Vertex editor
	this.vertexShader = new CodeEditor(this.vertexTab.element);
	this.vertexShader.setMode("glsl");
	this.vertexShader.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.vertexShader = self.vertexShader.getValue();
			self.material.needsUpdate = true;
		}
	});
}

ShaderMaterialEditor.prototype = Object.create(MaterialEditor.prototype);

ShaderMaterialEditor.prototype.attach = function(material, asset)
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
	this.blending.setValue(material.blending);	

	this.wireframe.setValue(material.wireframe);
	this.fragmentShader.setValue(material.fragmentShader);
	this.vertexShader.setValue(material.vertexShader);
};

ShaderMaterialEditor.prototype.updateInterface = function()
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
		this.camera.aspect = this.canvas.size.x / this.canvas.size.y;
		this.camera.updateProjectionMatrix();

		//Children
		for(var i = 0; i < this.children.length; i++)
		{
			this.children[i].visible = this.visible;
			this.children[i].updateInterface();
		}

		//Tab size
		this.tab.size.set(this.size.x - this.canvas.size.x - 5, this.size.y);
		this.tab.updateInterface();

		//Form
		this.form.visible = this.visible;
		this.form.updateInterface();

		//Fragment editor
		this.fragmentShader.size.copy(this.tab.size);
		this.fragmentShader.updateInterface();

		//Vertex editor
		this.vertexShader.size.copy(this.tab.size);
		this.vertexShader.updateInterface();

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