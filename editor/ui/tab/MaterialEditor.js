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
	var id = "mat_ed" + MaterialEditor.id;
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
	this.material = new THREE.MeshPhongMaterial({map: new Texture("data/texture/stone.jpg"), normalMap: new Texture("data/texture/stone_normal.jpg"), color:0xffffff, specular:0x777777, shininess:60});

	//Material renderer and scene
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFShadowMap;

	//Material camera
	this.camera = new PerspectiveCamera(90, this.canvas.size.x/this.canvas.size.y, 0.1, 10000000);

	//Material scene
	this.scene = new Scene();
	this.scene.add(new PointLight(0x444444));
	this.scene.add(new Sky());
	this.obj = new Model3D(new THREE.SphereBufferGeometry(1, 32, 32), this.material);
	this.obj.position.set(0, 0, -2.5);
	this.scene.add(this.obj);

	//----------------------------Material parameters----------------------------
	//Name
	var text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(10, 20);
	text.updateInterface();
	this.children.push(text);

	this.name = new Textbox(this.main.div_b);
	this.name.position.set(50, 10);
	this.name.size.set(200, 18);
	this.name.updateInterface();
	this.name.setOnChange(function()
	{
		if(self.material !== null)
		{
			self.material.name = self.name.getText();
		}
	});
	this.children.push(this.name);

	//Type
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Material Type");
	text.position.set(10, 45);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	this.type = new DropdownList(this.main.div_b);
	this.type.position.set(95, 35);
	this.type.size.set(150, 18);
	this.type.addValue("Phong", 0);
	/*this.type.addValue("Standard", 1);
	this.type.addValue("Lambert", 2);
	this.type.addValue("Basic", 3);
	this.type.addValue("Shader", 4);
	this.type.addValue("Sprite", 5);
	this.type.addValue("Depth", 6);
	this.type.addValue("Normal", 7);*/
	this.type.updateInterface();
	this.type.setOnChange(function()
	{
		if(self.material !== null)
		{
			//TODO <ADD CODE HERE>
		}
	});
	this.children.push(this.type);

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
	text.size.set(200, 0);
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
	this.opacity_text.size.set(200, 0);
	this.opacity_text.updateInterface();
	this.children.push(this.opacity_text);

	//----------------------------Phong Material parameters----------------------------
	//Color
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Color");
	text.position.set(10, 120);
	text.size.set(200, 0);
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
	text.size.set(200, 0);
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
	text.size.set(200, 0);
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
	this.shininess_text.size.set(200, 0);
	this.shininess_text.updateInterface();
	this.children.push(this.shininess_text);

	//Texture map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Texture map");
	text.position.set(10, 195);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	this.map = new Image(this.main.div_b);
	this.map.position.set(10, 205);
	this.map.size.set(100, 100);
	this.map.updateInterface();
	this.map.setCallback(function()
	{
		if(self.material !== null)
		{
			App.chooseFile(function(file)
			{
				self.material.map = new Texture(file);
				self.map.setImage(file);
			}, "image/*");
		}
	});
	this.children.push(this.map);

	//Bump map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Bump map");
	text.position.set(10, 320);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	this.bumpMap = new Image(this.main.div_b);
	this.bumpMap.position.set(10, 330);
	this.bumpMap.size.set(100, 100);
	this.bumpMap.updateInterface();
	this.bumpMap.setCallback(function()
	{
		if(self.material !== null)
		{
			App.chooseFile(function(file)
			{
				self.material.bumpMap = new Texture(file);
				self.bumpMap.setImage(file);
			}, "image/*");
		}
	});
	this.children.push(this.bumpMap);

	//Bump map scale
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Scale");
	text.position.set(10, 445);
	text.size.set(200, 0);
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
			self.bumpScale_text.setText(self.material.bumpScale);
		}
	});
	this.children.push(this.bumpScale);

	this.bumpScale_text = new Text(this.main.div_b);
	this.bumpScale_text.setAlignment(Text.LEFT);
	this.bumpScale_text.setText("");
	this.bumpScale_text.position.set(220, 445);
	this.bumpScale_text.size.set(200, 0);
	this.bumpScale_text.updateInterface();
	this.children.push(this.bumpScale_text);

	//Normal map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Normal map");
	text.position.set(10, 470);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	this.normalMap = new Image(this.main.div_b);
	this.normalMap.position.set(10, 480);
	this.normalMap.size.set(100, 100);
	this.normalMap.updateInterface();
	this.normalMap.setCallback(function()
	{
		if(self.material !== null)
		{
			App.chooseFile(function(file)
			{
				self.material.normalMap = new Texture(file);
				self.normalMap.setImage(file);
			}, "image/*");
		}
	});
	this.children.push(this.normalMap);

	//Normal map scale
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Scale X");
	text.position.set(10, 595);
	text.size.set(200, 0);
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
		}
	});
	this.children.push(this.normalScale_x);

	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Y");
	text.position.set(100, 595);
	text.size.set(200, 0);
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
		}
	});
	this.children.push(this.normalScale_y);

	//Displacement map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Displacement map");
	text.position.set(10, 620);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	this.displacementMap = new Image(this.main.div_b);
	this.displacementMap.position.set(10, 630);
	this.displacementMap.size.set(100, 100);
	this.displacementMap.updateInterface();
	this.displacementMap.setCallback(function()
	{
		if(self.material !== null)
		{
			App.chooseFile(function(file)
			{
				self.material.displacementMap = new Texture(file);
				self.displacementMap.setImage(file);
			}, "image/*");
		}
	});
	this.children.push(this.displacementMap);

	//Displacement map scale
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Scale");
	text.position.set(10, 745);
	text.size.set(200, 0);
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
		}
	});
	this.children.push(this.displacementScale);

	//Displacement map bias
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Bias");
	text.position.set(10, 770);
	text.size.set(200, 0);
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
		}
	});
	this.children.push(this.displacementBias);

	//Specular map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Specular map");
	text.position.set(10, 795);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	this.specularMap = new Image(this.main.div_b);
	this.specularMap.position.set(10, 805);
	this.specularMap.size.set(100, 100);
	this.specularMap.updateInterface();
	this.specularMap.setCallback(function()
	{
		if(self.material !== null)
		{
			App.chooseFile(function(file)
			{
				self.material.specularMap = new Texture(file);
				self.specularMap.setImage(file);
			}, "image/*");
		}
	});
	this.children.push(this.specularMap);

	//Alpha map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Alpha map");
	text.position.set(10, 920);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	this.alphaMap = new Image(this.main.div_b);
	this.alphaMap.position.set(10, 930);
	this.alphaMap.size.set(100, 100);
	this.alphaMap.updateInterface();
	this.alphaMap.setCallback(function()
	{
		if(self.material !== null)
		{
			App.chooseFile(function(file)
			{
				self.material.alphaMap = new Texture(file);
				self.alphaMap.setImage(file);
			}, "image/*");
		}
	});
	this.children.push(this.alphaMap);

	//Environment map
	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Environment map");
	text.position.set(10, 1045);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	this.envMap = new Image(this.main.div_b);
	this.envMap.position.set(10, 1055);
	this.envMap.size.set(100, 100);
	this.envMap.updateInterface();
	this.envMap.setCallback(function()
	{
		if(self.material !== null)
		{
			App.chooseFile(function(file)
			{
				self.material.envMap = new Texture(file);
				self.envMap.setImage(file);
			}, "image/*");
		}
	});
	this.children.push(this.envMap);

	//Combine mode (environment map)
	//TODO <ADD CODE HERE>

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
	this.renderer.render(this.scene, this.camera);

	if(Mouse.insideCanvas())
	{
		if(Mouse.buttonPressed(Mouse.LEFT))
		{
			var delta = new THREE.Quaternion();
			delta.setFromEuler(new THREE.Euler(Mouse.pos_diff.y * 0.005, Mouse.pos_diff.x * 0.005, 0, 'XYZ'));
			this.obj.quaternion.multiplyQuaternions(delta, this.obj.quaternion);
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
