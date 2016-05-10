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

	//Canvas
	this.canvas = new Canvas(this.element);
	this.canvas.position.set(0, 0);
	this.canvas.size.set(500, 500);
	this.canvas.updateInterface();

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Attached material
	this.material = new THREE.MeshPhongMaterial({map: new Texture("data/texture/stone.jpg"), normalMap: new Texture("data/texture/stone_normal.jpg"), color:0xffffff, specular:0x777777, shininess:60});

	//Material renderer and scene
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas.element, alpha: true});
	this.renderer.setSize(this.canvas.size.x, this.canvas.size.y);
	this.renderer.shadowMap.enabled = true;
	this.renderer.shadowMap.type = THREE.PCFShadowMap;

	//Material camera
	this.camera = new PerspectiveCamera(60, this.canvas.size.x/this.canvas.size.y, 0.1, 10000000);

	//Material scene
	this.scene = new Scene();

	//Light
	this.scene.add(new PointLight(0x555555));

	//Sphere
	var sphere = new Model3D(new THREE.SphereBufferGeometry(1, 32, 32), this.material);
	sphere.position.set(0, 0, -2.5);
	this.scene.add(sphere);

	//Add element to document
	this.parent.appendChild(this.element);
}

//MaterialEditor conter
MaterialEditor.id = 0;

//Functions Prototype
MaterialEditor.prototype.update = update;
MaterialEditor.prototype.updateInterface = updateInterface;
MaterialEditor.prototype.destroy = destroy;
MaterialEditor.prototype.activate = activate;

//Activate code editor
function activate()
{
	Editor.setState(Editor.STATE_IDLE);
	Editor.resetEditingFlags();
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
	this.renderer.render(this.scene, this.camera);

	
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

	//Update canvas
	this.canvas.visible = this.visible;
	this.canvas.updateInterface();

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}