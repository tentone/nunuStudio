function ObjectForm(parent)
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
	var id = "obj_form" + ObjectForm.id;
	ObjectForm.id++;

	//Create element
	this.element = document.createElement("ObjectForm");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "panel";
	
	//Textbox test
	this.name = new Textbox(this.element);
	this.name.size.set(200, 20);
	this.name.position.set(0, 5);
	this.name.updateInterface();

	//Checkbox test
	this.check = new Checkbox(this.element);
	this.check.size.set(200, 15);
	this.check.position.set(0, 40);
	this.check.updateInterface();

	//Color chooser
	this.color = new ColorChooser(this.element);
	this.color.size.set(200, 15);
	this.color.position.set(0, 60);
	this.color.updateInterface();

	//Slider
	this.slider = new Slider(this.element);
	this.slider.size.set(200, 15);
	this.slider.position.set(0, 80);
	this.slider.updateInterface();

	//Dropdown
	this.drop = new DropdownList(this.element);
	this.drop.size.set(200, 20);
	this.drop.position.set(0, 100);
	this.drop.updateInterface();

	this.drop.addValue("AAAAA");
	this.drop.addValue("BBBBB");
	this.drop.addValue("CCCCC");

	//Object attached
	this.obj = null;

	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//ObjectForm conter
ObjectForm.id = 0;

//Functions Prototype
ObjectForm.prototype.update = update;
ObjectForm.prototype.updateInterface = updateInterface;
ObjectForm.prototype.destroy = destroy;
ObjectForm.prototype.attachObject = attachObject;

function attachObject(obj)
{
	this.obj = obj;

	this.name.setText(this.obj.name);

	this.updateInterface();
}

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
}

//Update ObjectForm
function update(){}

//Update division Size
function updateInterface()
{
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
