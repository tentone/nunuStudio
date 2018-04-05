"use strict";

function ColorGradientChooser(parent)
{
	Element.call(this, parent);

	this.onChange = null;

	this.values = [];

	this.element.style.overflow = "visible";
	this.element.style.pointerEvents = "none";
	this.element.style.backgroundColor = Editor.theme.panelColor;
	this.element.style.borderStyle = "none";
	this.element.style.borderRadius = "4px";
	this.element.style.zIndex = 1000;

	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	this.canvas.style.width = "100%";
	this.canvas.style.height = "100%";
	this.element.appendChild(this.canvas);
}

ColorGradientChooser.prototype = Object.create(Element.prototype);

ColorGradientChooser.prototype.updateValues = function()
{
	this.canvas.width = this.size.x;
	this.canvas.height = this.size.y;

	var context = this.canvas.getContext("2d");
	var gradient = context.createLinearGradient(0, 0, this.canvas.width, 0);

	var width = 1 / (this.values.length - 1);
	for(var i = 0, x = 0; i < this.values.length; i++, x += width)
	{
		gradient.addColorStop(x, MathUtils.randomColor());
	}

	context.fillStyle = gradient;
	context.fillRect(0, 0, this.canvas.width, this.canvas.height);
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