"use strict";

function MaterialEditor(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}
	
	//ID
	var id = "material_editor" + MaterialEditor.id;
	MaterialEditor.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Main container
	this.main = new DualDivisionResizable(this.element);
	this.main.tab_position = 0.5;
	this.main.tab_position_min = 0.3;
	this.main.tab_position_max = 0.7;
	this.main.updateInterface();

	this.preview = new DualDivisionResizable(this.main.div_a);
	this.preview.orientation = DualDivisionResizable.VERTICAL;
	this.preview.tab_position = 0.8;
	this.preview.tab_position_min = 0.3;
	this.preview.tab_position_max = 0.8;
	this.preview.updateInterface();

	//Change preview div aspect
	this.preview.div_b.style.overflow = "auto";
	this.preview.div_b.style.cursor = "default";
	this.preview.div_b.style.backgroundColor = Editor.theme.panel_color;

	//Change main div aspect
	this.main.div_b.style.overflow = "auto";
	this.main.div_b.style.cursor = "default";
	this.main.div_b.style.backgroundColor = Editor.theme.panel_color;

	//Self pointer
	var self = this;

	//--------------------------------------Material preview--------------------------------------
	//Canvas
	this.canvas = new Canvas(this.preview.div_a);
	this.canvas.updateInterface();

	//Element atributes
	this.children = [];
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Material UI File element
	this.material_file = null;

	//Attached material
	this.material = null;

	//Material renderer and scene
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: Settings.antialiasing});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = Settings.shadows;
	this.renderer.shadowMap.type = Settings.shadows_type;

	//Material camera
	this.camera = new PerspectiveCamera(90, this.canvas.size.x/this.canvas.size.y, 0.1, 10000000);

	//Material preview scene
	this.scene = new Scene();
	this.sky = new Sky();
	var sun = this.sky.children[0];
	sun.shadow.camera.left = -5;
	sun.shadow.camera.right = 5;
	sun.shadow.camera.top = 5;
	sun.shadow.camera.bottom = -5;
	this.scene.add(this.sky);
	this.scene.add(new PointLight(0x666666));
	this.scene.add(new AmbientLight(0x555555));
	this.obj = new Model3D(new THREE.SphereBufferGeometry(1, 64, 64), null);
	this.obj.position.set(0, 0, -2.5);
	this.obj.visible = false;
	this.scene.add(this.obj);
	this.sprite = new Sprite(null);
	this.sprite.position.set(0, 0, -1.5);
	this.sprite.visible = false;
	this.scene.add(this.sprite);

	//--------------------------------Material preview configuration--------------------------------
	//Text
	var text = new Text(this.preview.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Configuration");
	text.position.set(10, 20);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	//Test model
	var text = new Text(this.preview.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Test Model");
	text.position.set(10, 45);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.test_model = new DropdownList(this.preview.div_b);
	this.test_model.position.set(80, 35);
	this.test_model.size.set(150, 18);
	this.test_model.addValue("Sphere", 0);
	this.test_model.addValue("Torus", 1);
	this.test_model.addValue("Cube", 2);
	this.test_model.addValue("Torus Knot", 3);
	this.test_model.updateInterface();
	this.test_model.setOnChange(function()
	{
		var value = self.test_model.getSelectedIndex();

		//Sphere
		if(value === 0)
		{
			self.obj.geometry = new THREE.SphereBufferGeometry(1, 128, 128);
		}
		//Torus
		else if(value === 1)
		{
			self.obj.geometry = new THREE.TorusBufferGeometry(0.8, 0.4, 64, 128);
		}
		//Cube
		else if(value === 2)
		{
			self.obj.geometry = new THREE.BoxBufferGeometry(1, 1, 1, 128, 128, 128);
		}
		//Torus Knot
		else if(value === 3)
		{
			self.obj.geometry = new THREE.TorusKnotBufferGeometry(0.7, 0.3, 128, 64);
		}	
	});
	this.children.push(this.test_model);

	//Sky enabled
	this.sky_enabled = new CheckBox(this.preview.div_b);
	this.sky_enabled.setText("Enable sky");
	this.sky_enabled.size.set(200, 15);
	this.sky_enabled.position.set(5, 60);
	this.sky_enabled.setValue(true);
	this.sky_enabled.updateInterface();
	this.sky_enabled.setOnChange(function()
	{
		self.sky.visible = self.sky_enabled.getValue();
	});
	this.children.push(this.sky_enabled);


	//---------------------------------------Generic Material parameters------------------------------------------
	this.form = new Form(this.main.div_b);
	this.form.position.set(10, 8);
	this.form.spacing.set(10, 8);
	
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
	this.side.addValue("Font", THREE.FrontSide);
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

	//Skinning
	this.skinning = new CheckBox(this.preview.div_b);
	this.skinning.setText("Skinning");
	this.skinning.size.set(200, 15);
	this.skinning.updateInterface();
	this.skinning.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.skinning = self.skinning.getValue();
		}
	});
	this.form.add(this.skinning);
	this.form.nextRow();

	//Test depth
	this.depthTest = new CheckBox(this.preview.div_b);
	this.depthTest.setText("Test depth");
	this.depthTest.size.set(200, 15);
	this.depthTest.updateInterface();
	this.depthTest.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.depthTest = self.depthTest.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.depthTest);
	this.form.nextRow();

	//Transparent
	this.transparent = new CheckBox(this.form.element);
	this.transparent.setText("Transparent");
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
			self.opacity_text.setText(self.material.opacity);
		}
	});
	this.form.add(this.opacity);
	this.opacity_text = this.form.addText("-------");
	this.form.nextRow();
	
	//Blending mode
	this.form.addText("Blending Mode");
	this.blending = new DropdownList(this.form.element);
	this.blending.position.set(100, 85);
	this.blending.size.set(150, 18);
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

	//Update form
	this.form.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
	
}

//Material editor counter
MaterialEditor.id = 0;

//Functions Prototype
MaterialEditor.prototype.attachMaterial = attachMaterial;
MaterialEditor.prototype.activate = activate;
MaterialEditor.prototype.destroy = destroy;
MaterialEditor.prototype.updateMetadata = updateMetadata;
MaterialEditor.prototype.update = update;
MaterialEditor.prototype.updateInterface = updateInterface;


//Attach material to material editor
function attachMaterial(material, material_file)
{
	//Check is if sprite material and ajust preview
	if(material instanceof THREE.SpriteMaterial)
	{
		this.sprite.material = material;
		this.sprite.visible = true;
		this.obj.visible = false;
	}
	else
	{
		this.obj.material = material;
		this.obj.visible = true;
		this.sprite.visible = false;
	}

	//Store material file pointer
	if(material_file !== undefined)
	{
		this.material_file = material_file;
	}
	
	//Store material
	this.material = material;

	//Generic material elements
	this.name.setText(material.name);
	this.side.setValue(material.side);
	this.skinning.setValue(material.skinning);
	this.depthTest.setValue(material.depthTest);
	this.transparent.setValue(material.transparent);
	this.opacity.setValue(material.opacity);
	this.opacity_text.setText(material.opacity);
	this.blending.setValue(material.blending);	
}

//Activate code editor
function activate()
{
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
	Mouse.canvas = this.canvas.element;
}

//Remove element
function destroy()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update container object data
function updateMetadata(container)
{
	if(this.material !== null)
	{
		if(this.material.name !== undefined)
		{
			container.setName(this.material.name);
		}
	}
}

//Update material editor
function update()
{
	//Update UI containers
	this.main.update();
	this.preview.update();

	if(this.material !== null)
	{
		//If needs update file metadata
		if(this.material.needsUpdate)
		{
			this.material_file.updateMetadata();
			this.material.needsUpdate = true;
		}

		//Render scene
		this.renderer.render(this.scene, this.camera);
	}

	if(Mouse.insideCanvas())
	{
		//Rotate object
		if(Mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new THREE.Quaternion();
			delta.setFromEuler(new THREE.Euler(Mouse.delta.y * 0.005, Mouse.delta.x * 0.005, 0, 'XYZ'));
			this.obj.quaternion.multiplyQuaternions(delta, this.obj.quaternion);
		}

		//Zoom
		this.camera.position.z += Mouse.wheel * 0.003;
		if(this.camera.position.z > 5)
		{
			this.camera.position.z = 5;
		}
		else if(this.camera.position.z < -1.5)
		{
			this.camera.position.z = -1.5;
		}
	}
}

//Update division Size
function updateInterface()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update main container
	this.main.visible = this.visible;
	this.main.size.copy(this.size);
	this.main.updateInterface();

	//Update preview container
	this.preview.visible = this.visible;
	this.preview.size.set(this.size.x * this.main.tab_position, this.size.y);
	this.preview.updateInterface();

	//Update canvas
	this.canvas.visible = this.visible;
	this.canvas.size.set(this.preview.div_a.offsetWidth, this.preview.div_a.offsetHeight);
	this.canvas.updateInterface();

	//Update renderer and canvas
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.camera.aspect = this.canvas.size.x/this.canvas.size.y
	this.camera.updateProjectionMatrix();

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].visible = this.visible;
		this.children[i].updateInterface();
	}

	//Update form
	this.form.visible = this.visible;
	this.form.updateInterface();

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
