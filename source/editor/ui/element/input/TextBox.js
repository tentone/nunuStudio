"use strict";

function TextBox(parent)
{
	Element.call(this, parent, "input");

	this.element.type = "text";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.margin = "0";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.textIndent = "4px";
	this.element.style.borderRadius = "4px";
}

TextBox.prototype = Object.create(Element.prototype);

//Set if element if disabled
TextBox.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
}

//Set onchange onChange
TextBox.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
}

//Set text
TextBox.prototype.setText = function(text)
{
	this.element.value = text;
}

//Get text
TextBox.prototype.getText = function()
{
	return this.element.value;
}

//Update Interface
TextBox.prototype.updateInterface = function()
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
}