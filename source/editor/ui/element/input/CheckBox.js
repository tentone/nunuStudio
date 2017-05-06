"use strict";

function CheckBox(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("input");
	this.element.style.position = "absolute";
	this.element.style.display = "block";
	this.element.style.boxSizing = "border-box";
	this.element.style.cursor = "pointer";
	this.element.style.appearance = "none";
	this.element.type = "checkbox";

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Add element to document
	this.parent.appendChild(this.element);
};

//Set if element if disabled
CheckBox.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
};

//Set checkbox value
CheckBox.prototype.setValue = function(value)
{
	this.element.checked = value;
};

//Get checkbox value
CheckBox.prototype.getValue = function()
{
	return this.element.checked;
};

//Set onchange onChange
CheckBox.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

//Remove element
CheckBox.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

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

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};