"use strict";

function CheckBox(parent)
{
	Element.call(this, parent, "input");

	this.element.style.display = "block";
	this.element.style.boxSizing = "border-box";
	this.element.style.cursor = "pointer";
	this.element.type = "checkbox";

	//this.element.style.appearance = "none";
	//this.element.style.MozAppearance = "none";
	//this.element.style.webkitAppearance = "none";
};

CheckBox.prototype = Object.create(Element.prototype);

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

//Update Interface
CheckBox.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};