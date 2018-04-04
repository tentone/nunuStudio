"use strict";

function ColorGradientChooser(parent)
{
	Element.call(this, parent);

	this.onChange = null;

	this.values = [];

	this.element.style.overflow = "visible";
	this.element.style.pointerEvents = "none";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	this.canvas.style.width = "100%";
	this.canvas.style.height = "100%";
}

ColorGradientChooser.prototype = Object.create(Element.prototype);

ColorGradientChooser.prototype.updateValues = function()
{
	this.canvas.width = this.size.x;
	this.canvas.height = this.size.y;

	//TODO <ADD CODE HERE>

	for(var i = 0; i < this.values.length; i++)
	{
		//TODO <ADD CODE HERE>
	}
};

ColorGradientChooser.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
};

ColorGradientChooser.prototype.setValue = function(values)
{
	this.values = values;
	this.updateValues();
};

ColorGradientChooser.prototype.getValue = function()
{
	return this.values;
};