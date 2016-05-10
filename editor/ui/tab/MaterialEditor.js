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
	this.main.tab_position = 0.3;
	this.main.updateInterface();

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
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element}); //, alpha: true});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFShadowMap;

	//Material camera
	this.camera = new PerspectiveCamera(60, this.canvas.size.x/this.canvas.size.y, 0.1, 10000000);

	//Material scene
	this.scene = new Scene();
	this.scene.add(new PointLight(0x333333));
	this.scene.add(new Sky());
	this.obj = new Model3D(new THREE.SphereBufferGeometry(1, 32, 32), this.material);
	this.obj.position.set(0, 0, -2.5);
	this.scene.add(this.obj);

	//----------------------------Material paremeters----------------------------
	var text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Name");
	text.position.set(10, 20);
	text.updateInterface();
	this.children.push(text);

	//Name textbox
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
	this.type.addValue("Standard", 0);
	this.type.addValue("Lambert", 1);
	this.type.addValue("Phong", 2);
	this.type.addValue("Basic", 3);
	this.type.addValue("Shader", 4);
	this.type.addValue("Sprite", 5);
	this.type.addValue("Depth", 6);
	this.type.addValue("Normal", 7);
	this.type.updateInterface();
	this.type.setOnChange(function()
	{
		if(self.obj !== null)
		{
			//TODO <ADD CODE HERE>
		}
	});
	this.children.push(this.type);

	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Transparent");
	text.position.set(10, 70);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Opacity");
	text.position.set(10, 95);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

	text = new Text(this.main.div_b);
	text.setAlignment(Text.LEFT);
	text.setText("Transparent");
	text.position.set(10, 120);
	text.size.set(200, 0);
	text.updateInterface();
	this.children.push(text);

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

	//Update interface
	//this.updateInterface();
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
			delta.setFromEuler(new THREE.Euler(Mouse.pos_diff.y * 0.01, Mouse.pos_diff.x * 0.01, 0, 'XYZ'));
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
	this.canvas.size.set(this.main.div_a.offsetWidth, this.main.div_a.offsetWidth);
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