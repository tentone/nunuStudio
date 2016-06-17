function Checkbox(parent)
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
	var id = "checkbox" + Checkbox.id;
	Checkbox.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//Checkbox
	this.checkbox = document.createElement("input");
	this.checkbox.type = "checkbox";
	this.checkbox.style.position = "absolute";
	this.checkbox.style.left = "-3px";
	this.element.appendChild(this.checkbox);

	//Text
	this.text = new Text(this.element);
	this.text.setAlignment(Text.LEFT);
	this.text.updateInterface();

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	this.callback = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Checkbox ID counter
Checkbox.id = 0;

//Functions Prototype
Checkbox.prototype.update = update;
Checkbox.prototype.updateInterface = updateInterface;
Checkbox.prototype.destroy = destroy;
Checkbox.prototype.setOnChange = setOnChange;
Checkbox.prototype.setText = setText;
Checkbox.prototype.getValue = getValue;
Checkbox.prototype.setValue = setValue;

//Set checkbox value
function setValue(value)
{
	this.checkbox.checked = value;
}

//Get checkbox value
function getValue()
{
	return this.checkbox.checked;
}

//Set checkbox text
function setText(text)
{
	this.text.setText(text);
}

//Set onchange callback
function setOnChange(callback)
{
	this.element.onchange = callback;
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

//Update
function update(){}

//Update Interface
function updateInterface()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	this.checkbox.style.width = this.size.y + "px";
	this.checkbox.style.height = this.size.y + "px";

	this.text.size.set(this.size.x, 0);
	this.text.position.set(this.size.y + 5, this.size.y/2 + 2);
	this.text.visible = this.visible;
	this.text.updateInterface();

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}