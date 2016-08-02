"use strict";

function CheckBox(parent)
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
	var id = "checkbox" + CheckBox.id;
	CheckBox.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	//CheckBox
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

//CheckBox ID counter
CheckBox.id = 0;

//Functions Prototype
CheckBox.prototype.update = update;
CheckBox.prototype.updateInterface = updateInterface;
CheckBox.prototype.destroy = destroy;
CheckBox.prototype.setOnChange = setOnChange;
CheckBox.prototype.setText = setText;
CheckBox.prototype.getValue = getValue;
CheckBox.prototype.setValue = setValue;
CheckBox.prototype.setDisabled = setDisabled;

//Set if element if disabled
function setDisabled(value)
{
	this.checkbox.disabled = value;
}

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