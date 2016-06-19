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
	var id = "mat_editor" + MaterialEditor.id;
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

	//Set main div B as panel
	this.preview.div_b.className = "panel";
	this.main.div_b.className = "panel";

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
	
	//Attached material
	this.material = null;

	//Material renderer and scene
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, antialias: true});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFShadowMap;

	//Material camera
	this.camera = new PerspectiveCamera(90, this.canvas.size.x/this.canvas.size.y, 0.1, 10000000);

	//Material preview scene
	this.scene = new Scene();
	this.obj = new Model3D(new THREE.SphereBufferGeometry(1, 64, 64), null);
	this.obj.position.set(0, 0, -2.5);
	this.obj.visible = false;
	this.scene.add(this.obj);
	this.sprite = new Sprite(null);
	this.sprite.position.set(0, 0, -2.5);
	this.sprite.visible = false;
	this.scene.add(this.sprite);
	this.scene.add(new PointLight(0x666666));
	this.scene.add(new AmbientLight(0x444444));
	this.sky = new Sky();
	this.scene.add(this.sky);

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
	this.sky_enabled = new Checkbox(this.preview.div_b);
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
	this.name = new Textbox(this.form.element);
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
		}
	});
	this.form.add(this.side);
	this.form.nextRow();

	//Skinning
	this.skinning = new Checkbox(this.preview.div_b);
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

	//Transparent
	this.transparent = new Checkbox(this.form.element);
	this.transparent.setText("Transparent");
	this.transparent.size.set(200, 15);
	this.transparent.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.transparent = self.transparent.getValue();
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
		}
	});
	this.form.add(this.blending);
	this.form.nextRow();

	//--------------------------------------Phong Material parameters--------------------------------------
	//Shading mode
	this.form.addText("Shading");
	this.shading = new DropdownList(this.form.element);
	this.shading.position.set(100, 85);
	this.shading.size.set(120, 18);
	this.shading.addValue("Smooth", THREE.SmoothShading);
	this.shading.addValue("Flat", THREE.FlatShading);
	this.shading.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.shading = self.shading.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.shading);
	this.form.nextRow();

	//Color
	this.form.addText("Color");
	this.color = new ColorChooser(this.form.element);
	this.color.size.set(100, 18);
	this.color.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.color.setHex(self.color.getValueHex());
		}
	});
	this.form.add(this.color);
	this.form.nextRow();

	//Specular color
	this.form.addText("Specular");
	this.specular = new ColorChooser(this.form.element);
	this.specular.size.set(100, 18);
	this.specular.updateInterface();
	this.specular.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.specular.setHex(self.specular.getValueHex());
		}
	});
	this.form.add(this.specular);
	this.form.nextRow();

	//Shininess
	this.form.addText("Shininess");
	this.shininess = new Slider(this.form.element);
	this.shininess.size.set(160, 18);
	this.shininess.setRange(0, 250);
	this.shininess.setStep(0.1);
	this.shininess.updateInterface();
	this.shininess.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.shininess = self.shininess.getValue();
			self.shininess_text.setText(self.material.shininess);
		}
	});
	this.form.add(this.shininess);
	this.shininess_text = this.form.addText("-------");
	this.form.nextRow();

	//Texture map
	this.form.addText("Texture map");
	this.form.nextRow();
	this.map = new Imagebox(this.form.element);
	this.map.size.set(100, 100);
	this.map.updateInterface();
	this.map.setOnChange(function(file)
	{
		self.material.map = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.form.add(this.map);
	this.form.nextRow();

	//Bump map
	this.form.addText("Bump map");
	this.form.nextRow();
	this.bumpMap = new Imagebox(this.form.element);
	this.bumpMap.size.set(100, 100);
	this.bumpMap.updateInterface();
	this.bumpMap.setOnChange(function(file)
	{
		self.material.bumpMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.form.add(this.bumpMap);
	this.form.nextRow();

	//Bump map scale
	this.form.addText("Scale");
	this.bumpScale = new Slider(this.form.element);
	this.bumpScale.size.set(160, 18);
	this.bumpScale.setRange(0, 1);
	this.bumpScale.setStep(0.01);
	this.bumpScale.updateInterface();
	this.bumpScale.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.bumpScale = self.bumpScale.getValue();
			self.material.needsUpdate = true;
			self.bumpScale_text.setText(self.material.bumpScale);
		}
	});
	this.form.add(this.bumpScale);
	this.bumpScale_text = this.form.addText("-------");
	this.form.nextRow();

	//Normal map
	this.form.addText("Normal map");
	this.form.nextRow();
	this.normalMap = new Imagebox(this.form.element);
	this.normalMap.size.set(100, 100);
	this.normalMap.updateInterface();
	this.normalMap.setOnChange(function(file)
	{
		self.material.normalMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.form.add(this.normalMap);
	this.form.nextRow();

	//Normal map scale
	this.form.addText("Scale X");
	this.normalScale_x = new Numberbox(this.form.element);
	this.normalScale_x.size.set(35, 18);
	this.normalScale_x.setRange(0, 1);
	this.normalScale_x.setStep(0.01);
	this.normalScale_x.updateInterface();
	this.normalScale_x.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.normalScale.x = self.normalScale_x.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.normalScale_x);
	this.form.addText("Y");
	this.normalScale_y = new Numberbox(this.form.element);
	this.normalScale_y.size.set(40, 18);
	this.normalScale_y.setRange(0, 1);
	this.normalScale_y.setStep(0.01);
	this.normalScale_y.updateInterface();
	this.normalScale_y.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.normalScale.y = self.normalScale_y.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.normalScale_y);
	this.form.nextRow();

	//Displacement map
	this.form.addText("Displacement map");
	this.form.nextRow();
	this.displacementMap = new Imagebox(this.form.element);
	this.displacementMap.size.set(100, 100);
	this.displacementMap.updateInterface();
	this.displacementMap.setOnChange(function(file)
	{
		self.material.displacementMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.displacementMap);
	this.form.add(this.displacementMap);
	this.form.nextRow();

	//Displacement map scale
	this.form.addText("Scale");
	this.displacementScale = new Numberbox(this.form.element);
	this.displacementScale.size.set(60, 18);
	this.displacementScale.setStep(0.05);
	this.displacementScale.updateInterface();
	this.displacementScale.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.displacementScale = self.displacementScale.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.displacementScale);
	this.form.nextRow();

	//Displacement map bias
	this.form.addText("Bias");
	this.displacementBias = new Numberbox(this.form.element);
	this.displacementBias.size.set(60, 18);
	this.displacementBias.setStep(0.1);
	this.displacementBias.updateInterface();
	this.displacementBias.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.displacementBias = self.displacementBias.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.displacementBias);
	this.form.nextRow();

	//Specular map
	this.form.addText("Specular map");
	this.form.nextRow();
	this.specularMap = new Imagebox(this.form.element);
	this.specularMap.size.set(100, 100);
	this.specularMap.updateInterface();
	this.specularMap.setOnChange(function(file)
	{
		self.material.specularMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.form.add(this.specularMap);
	this.form.nextRow();

	//Alpha map
	this.form.addText("Alpha map");
	this.form.nextRow();
	this.alphaMap = new Imagebox(this.form.element);
	this.alphaMap.size.set(100, 100);
	this.alphaMap.updateInterface();
	this.alphaMap.setOnChange(function(file)
	{
		self.material.alphaMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.form.add(this.alphaMap);
	this.form.nextRow();

	//Environment map
	this.form.addText("Environment map");
	this.form.nextRow();
	this.envMap = new Imagebox(this.form.element);
	this.envMap.size.set(100, 100);
	this.envMap.updateInterface();
	this.envMap.setOnChange(function(file)
	{
		var files = [file, file, file, file, file, file];
		self.material.envMap = new THREE.CubeTextureLoader().load(files);
		self.material.envMap.format = THREE.RGBFormat;
		self.material.needsUpdate = true;
	});
	this.form.add(this.envMap);
	this.form.nextRow();

	//Combine environment map
	this.form.addText("Mode");
	this.combine = new DropdownList(this.form.element);
	this.combine.position.set(100, 85);
	this.combine.size.set(120, 18);
	this.combine.addValue("Multiply", THREE.MultiplyOperation);
	this.combine.addValue("Mix", THREE.MixOperation);
	this.combine.addValue("Add", THREE.AddOperation);
	this.combine.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.combine = self.combine.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.combine);
	this.form.nextRow();

	//Reflectivity
	this.form.addText("Reflectivity");
	this.reflectivity = new Numberbox(this.form.element);
	this.reflectivity.size.set(60, 18);
	this.reflectivity.setStep(0.05);
	this.reflectivity.updateInterface();
	this.reflectivity.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.reflectivity = self.reflectivity.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.reflectivity);
	this.form.nextRow();

	//Reflectivity
	this.form.addText("Refraction Ratio");
	this.refractionRatio = new Numberbox(this.form.element);
	this.refractionRatio.size.set(60, 18);
	this.refractionRatio.setStep(0.05);
	this.refractionRatio.updateInterface();
	this.refractionRatio.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.refractionRatio = self.refractionRatio.getValue();
			self.material.needsUpdate = true;
		}
	});
	this.form.add(this.refractionRatio);

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
MaterialEditor.prototype.update = update;
MaterialEditor.prototype.updateInterface = updateInterface;
MaterialEditor.prototype.updateContainerMetaData = updateContainerMetaData;

//Update container object data
function updateContainerMetaData(container)
{
	if(this.material !== null)
	{
		if(this.material.name !== undefined)
		{
			container.setName(this.material.name);
		}
	}
}

//Attach material to material editor
function attachMaterial(material)
{
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
	this.material = material;
}

//Activate code editor
function activate()
{
	//Set editor state
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
	
	//Set mouse canvas
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

//Update material editor
function update()
{
	this.main.update();
	this.preview.update();

	if(this.material !== null)
	{
		this.renderer.render(this.scene, this.camera);
	}

	if(Mouse.insideCanvas())
	{
		if(Mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new THREE.Quaternion();
			delta.setFromEuler(new THREE.Euler(Mouse.delta.y * 0.005, Mouse.delta.x * 0.005, 0, 'XYZ'));
			this.obj.quaternion.multiplyQuaternions(delta, this.obj.quaternion);
		}

		this.camera.position.z += Mouse.wheel * 0.005;
		if(this.camera.position.z > 5)
		{
			this.camera.position.z = 5;
		}
		else if(this.camera.position.z < -1)
		{
			this.camera.position.z = -1;
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
