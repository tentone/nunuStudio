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

	//Set main div B as panel
	this.main.div_b.className = "panel";

	//Self pointer
	var self = this;

	//----------------------------Material preview----------------------------
	//Canvas
	this.canvas = new Canvas(this.main.div_a);
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
	this.scene.add(new Sky());

	//----------------------------Material parameters----------------------------
	//Type
	/*text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Material Type");
	text.position.set(10, 70);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.type = new DropdownList(this.main.div_b);
	this.type.position.set(95, 60);
	this.type.size.set(150, 18);
	this.type.addValue("Phong", 0);
	this.type.addValue("Standard", 1);
	this.type.addValue("Lambert", 2);
	this.type.addValue("Basic", 3);
	this.type.addValue("Shader", 4);
	this.type.addValue("Sprite", 5);
	this.type.addValue("Depth", 6);
	this.type.addValue("Normal", 7);
	this.type.updateInterface();
	this.type.setOnChange(function()
	{
		if(self.material !== null)
		{
			//TODO <ADD CODE HERE>
		}
	});
	this.children.push(this.type);*/

	//Test model
	var text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Test Model");
	text.position.set(10, 20);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.test_model = new DropdownList(this.main.div_b);
	this.test_model.position.set(80, 10);
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

	//Name
	var text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(10, 45);
	text.updateInterface();
	this.children.push(text);

	this.name = new Textbox(this.main.div_b);
	this.name.position.set(50, 35);
	this.name.size.set(200, 18);
	this.name.updateInterface();
	this.name.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.name = self.name.getText();
			Editor.updateAssetExplorer();
		}
	});
	this.children.push(this.name);

	//Transparent
	this.transparent = new Checkbox(this.main.div_b);
	this.transparent.setText("Transparent");
	this.transparent.size.set(200, 15);
	this.transparent.position.set(5, 60);
	this.transparent.updateInterface();
	this.transparent.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.transparent = self.transparent.getValue();
		}
	});
	this.children.push(this.transparent);

	//Opacity level
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Opacity");
	text.position.set(10, 95);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.opacity = new Slider(this.main.div_b);
	this.opacity.size.set(160, 18);
	this.opacity.position.set(55, 85);
	this.opacity.setRange(0, 1);
	this.opacity.setStep(0.01);
	this.opacity.updateInterface();
	this.opacity.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.opacity = self.opacity.getValue();
			self.opacity_text.setText(self.material.opacity);
		}
	});
	this.children.push(this.opacity);

	this.opacity_text = new Text(this.main.div_b);
	this.opacity_text.setAlignment(Text.LEFT);
	this.opacity_text.setText("");
	this.opacity_text.position.set(220, 95);
	this.opacity_text.fit_content = true;
	this.opacity_text.updateInterface();
	this.children.push(this.opacity_text);

	//Blending mode
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Blending Mode");
	text.position.set(10, 120);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.blending = new DropdownList(this.main.div_b);
	this.blending.position.set(100, 110);
	this.blending.size.set(150, 18);
	this.blending.addValue("None", THREE.NoBlending);
	this.blending.addValue("Normal", THREE.NormalBlending);
	this.blending.addValue("Additive", THREE.AdditiveBlending);
	this.blending.addValue("Subtractive", THREE.SubtractiveBlending);
	this.blending.addValue("Multiply", THREE.MultiplyBlending);
	this.blending.updateInterface();
	this.blending.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.blending = self.blending.getValue();
		}
	});
	this.children.push(this.blending);

	//Blending source
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Blending Source");
	text.position.set(10, 145);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.blendSrc = new DropdownList(this.main.div_b);
	this.blendSrc.position.set(115, 135);
	this.blendSrc.size.set(150, 18);
	this.blendSrc.addValue("DstColorFactor", THREE.DstColorFactor);
	this.blendSrc.addValue("OneMinusDstColorFactor", THREE.OneMinusDstColorFactor);
	this.blendSrc.addValue("SrcAlphaSaturateFactor", THREE.SrcAlphaSaturateFactor);
	this.blendSrc.updateInterface();
	this.blendSrc.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.blendSrc = self.blendSrc.getValue();
		}
	});
	this.children.push(this.blendSrc);

	//Blending destination
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Blending Destination");
	text.position.set(10, 170);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.blendDst = new DropdownList(this.main.div_b);
	this.blendDst.position.set(135, 160);
	this.blendDst.size.set(150, 18);
	this.blendDst.addValue("ZeroFactor", THREE.ZeroFactor);
	this.blendDst.addValue("OneFactor", THREE.OneFactor);
	this.blendDst.addValue("SrcColorFactor", THREE.SrcColorFactor);
	this.blendDst.addValue("OneMinusSrcColorFactor", THREE.OneMinusSrcColorFactor);
	this.blendDst.addValue("SrcAlphaFactor", THREE.SrcAlphaFactor);
	this.blendDst.addValue("OneMinusSrcAlphaFactor", THREE.OneMinusSrcAlphaFactor);
	this.blendDst.addValue("DstAlphaFactor", THREE.DstAlphaFactor);
	this.blendDst.addValue("OneMinusDstAlphaFactor", THREE.OneMinusDstAlphaFactor);
	this.blendDst.updateInterface();
	this.blendDst.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.blendDst = self.blendDst.getValue();
		}
	});
	this.children.push(this.blendDst);

	/*
	//----------------------------Phong Material parameters----------------------------
	//Color
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Color");
	text.position.set(10, 120);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.color = new ColorChooser(this.main.div_b);
	this.color.size.set(100, 18);
	this.color.position.set(45, 110);
	this.color.updateInterface();
	this.color.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.color.setHex(self.color.getValueHex());
		}
	});
	this.children.push(this.color);

	//Specular color
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Specular");
	text.position.set(10, 145);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.specular = new ColorChooser(this.main.div_b);
	this.specular.size.set(100, 18);
	this.specular.position.set(65, 135);
	this.specular.updateInterface();
	this.specular.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.specular.setHex(self.specular.getValueHex());
		}
	});
	this.children.push(this.specular);

	//Shininess
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Shininess");
	text.position.set(10, 170);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.shininess = new Slider(this.main.div_b);
	this.shininess.size.set(160, 18);
	this.shininess.position.set(70, 160);
	this.shininess.setRange(0, 250);
	this.shininess.setStep(1);
	this.shininess.updateInterface();
	this.shininess.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.shininess = self.shininess.getValue();
			self.shininess_text.setText(self.material.shininess);
		}
	});
	this.children.push(this.shininess);

	this.shininess_text = new Text(this.main.div_b);
	this.shininess_text.setAlignment(Text.LEFT);
	this.shininess_text.setText("");
	this.shininess_text.position.set(240, 170);
	this.shininess_text.fit_content = true;
	this.shininess_text.updateInterface();
	this.children.push(this.shininess_text);

	//Texture map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Texture map");
	text.position.set(10, 195);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.map = new Imagebox(this.main.div_b);
	this.map.position.set(10, 205);
	this.map.size.set(100, 100);
	this.map.updateInterface();
	this.map.setOnChange(function(file)
	{
		self.material.map = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.map);

	//Bump map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Bump map");
	text.position.set(10, 320);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.bumpMap = new Imagebox(this.main.div_b);
	this.bumpMap.position.set(10, 330);
	this.bumpMap.size.set(100, 100);
	this.bumpMap.updateInterface();
	this.bumpMap.setOnChange(function(file)
	{
		self.material.bumpMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.bumpMap);

	//Bump map scale
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Scale");
	text.position.set(10, 445);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.bumpScale = new Slider(this.main.div_b);
	this.bumpScale.size.set(160, 18);
	this.bumpScale.position.set(50, 435);
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
	this.children.push(this.bumpScale);

	this.bumpScale_text = new Text(this.main.div_b);
	this.bumpScale_text.setAlignment(Text.LEFT);
	this.bumpScale_text.setText("");
	this.bumpScale_text.position.set(220, 445);
	this.bumpScale_text.fit_content = true;
	this.bumpScale_text.updateInterface();
	this.children.push(this.bumpScale_text);

	//Normal map
	/*text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Normal map");
	text.position.set(10, 470);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.normalMap = new Imagebox(this.main.div_b);
	this.normalMap.position.set(10, 480);
	this.normalMap.size.set(100, 100);
	this.normalMap.updateInterface();
	this.normalMap.setOnChange(function(file)
	{
		self.material.normalMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.normalMap);

	//Normal map scale
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Scale X");
	text.position.set(10, 595);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.normalScale_x = new Numberbox(this.main.div_b);
	this.normalScale_x.size.set(35, 18);
	this.normalScale_x.position.set(60, 585);
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
	this.children.push(this.normalScale_x);

	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Y");
	text.position.set(100, 595);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.normalScale_y = new Numberbox(this.main.div_b);
	this.normalScale_y.size.set(40, 18);
	this.normalScale_y.position.set(115, 585);
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
	this.children.push(this.normalScale_y);

	//Displacement map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Displacement map");
	text.position.set(10, 620);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.displacementMap = new Imagebox(this.main.div_b);
	this.displacementMap.position.set(10, 630);
	this.displacementMap.size.set(100, 100);
	this.displacementMap.updateInterface();
	this.displacementMap.setOnChange(function(file)
	{
		self.material.displacementMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.displacementMap);

	//Displacement map scale
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Scale");
	text.position.set(10, 745);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.displacementScale = new Numberbox(this.main.div_b);
	this.displacementScale.size.set(60, 18);
	this.displacementScale.position.set(50, 735);
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
	this.children.push(this.displacementScale);

	//Displacement map bias
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Bias");
	text.position.set(10, 770);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.displacementBias = new Numberbox(this.main.div_b);
	this.displacementBias.size.set(60, 18);
	this.displacementBias.position.set(45, 760);
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
	this.children.push(this.displacementBias);

	//Specular map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Specular map");
	text.position.set(10, 795);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.specularMap = new Imagebox(this.main.div_b);
	this.specularMap.position.set(10, 805);
	this.specularMap.size.set(100, 100);
	this.specularMap.updateInterface();
	this.specularMap.setOnChange(function(file)
	{
		self.material.specularMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.specularMap);

	//Alpha map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Alpha map");
	text.position.set(10, 920);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.alphaMap = new Imagebox(this.main.div_b);
	this.alphaMap.position.set(10, 930);
	this.alphaMap.size.set(100, 100);
	this.alphaMap.updateInterface();
	this.alphaMap.setOnChange(function(file)
	{
		self.material.alphaMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.alphaMap);

	//Environment map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Environment map");
	text.position.set(10, 1045);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.envMap = new Imagebox(this.main.div_b);
	this.envMap.position.set(10, 1055);
	this.envMap.size.set(100, 100);
	this.envMap.updateInterface();
	this.envMap.setOnChange(function(file)
	{
		self.material.envMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.envMap);

	//Combine mode (environment map)
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Combine mode");
	text.position.set(10, 1070);
	text.fit_content = true;
	text.updateInterface();
	this.children.push(text);

	this.envMap = new Imagebox(this.main.div_b);
	this.envMap.position.set(10, 1055);
	this.envMap.size.set(100, 100);
	this.envMap.updateInterface();
	this.envMap.setOnChange(function(file)
	{
		self.material.envMap = new Texture(file);
		self.material.needsUpdate = true;
	});
	this.children.push(this.envMap);*/


	//Add element to document
	this.parent.appendChild(this.element);
	
}

//Materialeditor counter
MaterialEditor.id = 0;

//Functions Prototype
MaterialEditor.prototype.update = update;
MaterialEditor.prototype.updateInterface = updateInterface;
MaterialEditor.prototype.destroy = destroy;
MaterialEditor.prototype.activate = activate;
MaterialEditor.prototype.attachMaterial = attachMaterial;

//Attach material to material editor
function attachMaterial(material)
{
	this.material = material;
	this.obj.material = material;
	this.obj.visible = true;
	this.sprite.visible = false;
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
	
	if(this.material !== null)
	{
		this.renderer.render(this.scene, this.camera);
	}

	if(Mouse.insideCanvas())
	{
		if(Mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new THREE.Quaternion();
			delta.setFromEuler(new THREE.Euler(Mouse.pos_diff.y * 0.005, Mouse.pos_diff.x * 0.005, 0, 'XYZ'));
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

	//Update canvas
	this.canvas.visible = this.visible;
	this.canvas.size.set(this.main.div_a.offsetWidth, this.main.div_a.offsetHeight);
	this.canvas.updateInterface();

	//Update renderer and canvas
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.camera.aspect = this.canvas.size.x/this.canvas.size.y
	this.camera.updateProjectionMatrix();

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].visible = this.visible;
		this.children[i].updateInterface();
	}

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
