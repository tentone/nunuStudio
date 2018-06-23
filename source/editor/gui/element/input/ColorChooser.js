"use strict";

function ColorChooser(parent)
{
	Element.call(this, parent, "input");

	this.element.type = "text";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.textIndent = "4px";
	this.element.style.borderRadius = "4px";
	this.element.style.boxShadow = "none";
	this.element.style.MozAppearance = "textfield";
	this.element.style.webkitAppearance = "caret";
	this.element.style.appearance = "textfield";

	//Color chooser
	this.color = new jscolor(this.element);
	this.color.backgroundColor = Editor.theme.boxColor;
	this.color.insetColor = Editor.theme.boxColor;
	this.color.shadow = false;
	this.color.borderWidth = 0;
	this.color.borderRadius = 0;
	this.color.zIndex = 2000;

	//Attributes
	this.onChange = null;
}

ColorChooser.prototype = Object.create(Element.prototype);

//Set onchange onChange
ColorChooser.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

//Set color
ColorChooser.prototype.setValue = function(r, g, b)
{
	this.color.fromRGB(r*255, g*255, b*255);
};

//Set color value hex
ColorChooser.prototype.setValueHex = function(hex)
{
	hex = Math.floor(hex);
	this.color.fromRGB(hex >> 16 & 255, hex >> 8 & 255, hex & 255);
};

//Set valur from CSS string
ColorChooser.prototype.setValueString = function(color)
{
	this.color.fromString(color);
};

ColorChooser.prototype.getValueString = function(color)
{
	return this.color.toHEXString();
};

//Get color value
ColorChooser.prototype.getValue = function()
{
	return {r: this.color.rgb[0]/255, g: this.color.rgb[1]/255, b: this.color.rgb[2]/255};
};

//Get color value hex
ColorChooser.prototype.getValueHex = function()
{
	return (this.color.rgb[0] << 16 ^ this.color.rgb[1] << 8 ^ this.color.rgb[2] << 0);
};

ColorChooser.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};
