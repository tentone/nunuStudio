"use strict";

function TextArea(parent)
{
	Element.call(this, parent, "textarea");

	this.element.style.overflow = "auto";
	this.element.style.resize = "none";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.fontFamily = Editor.theme.font;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.borderRadius = "4px";
}

TextArea.prototype = Object.create(Element.prototype);

//Set if element if disabled
TextArea.prototype.setDisabled = function(value)
{
	this.element.disabled = value;
};

//Set onchange onChange
TextArea.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

//Set text
TextArea.prototype.setText = function(text)
{
	this.element.value = text;
};

//Get text
TextArea.prototype.getText = function()
{
	return this.element.value;
};

//Update Interface
TextArea.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = (this.size.y - 5) + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};