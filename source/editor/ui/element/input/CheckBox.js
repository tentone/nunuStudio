"use strict";

function CheckBox(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

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

//Set if element if disabled
CheckBox.prototype.setDisabled = function(value)
{
	this.checkbox.disabled = value;
}

//Set checkbox value
CheckBox.prototype.setValue = function(value)
{
	this.checkbox.checked = value;
}

//Get checkbox value
CheckBox.prototype.getValue = function()
{
	return this.checkbox.checked;
}

//Set checkbox text
CheckBox.prototype.setText = function(text)
{
	this.text.setText(text);
}

//Set onchange callback
CheckBox.prototype.setOnChange = function(callback)
{
	this.element.onchange = callback;
}

//Remove element
CheckBox.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
CheckBox.prototype.update = function(){}

//Update Interface
CheckBox.prototype.updateInterface = function()
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