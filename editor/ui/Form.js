function Form(parent)
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
	var id = "form" + Form.id;
	Form.id++;

	//Create element
	this.element = document.createElement("form");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "panel";
	
	//Textbox test
	this.text = new Textbox(this.element);
	this.text.size.set(200, 20);
	this.text.position.set(0, 5);
	this.text.updateInterface();
	this.text.setText("teste");

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


	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Form conter
Form.id = 0;

//Functions Prototype
Form.prototype.update = update;
Form.prototype.updateInterface = updateInterface;
Form.prototype.destroy = destroy;

//Remove element
function destroy()
{
	this.parent.removeChild(this.element);
}

//Update Form
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
