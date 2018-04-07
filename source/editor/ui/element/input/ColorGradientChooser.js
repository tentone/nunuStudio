"use strict";

function ColorGradientChooser(parent)
{
	Element.call(this, parent);

	this.onChange = null;

	this.values = [];

	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.borderRadius = "4px";

	//TODO <REMOVE THIS>
	this.element.style.zIndex = "2000";

	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	this.canvas.style.width = "100%";
	this.canvas.style.height = "100%";
	this.element.appendChild(this.canvas);

	this.buttons = document.createElement("div");
	this.buttons.style.position = "absolute";
	this.buttons.style.top = "0px";
	this.buttons.style.left = "0px";
	this.buttons.style.width = "100%";
	this.buttons.style.height = "100%";
	this.element.appendChild(this.buttons);
}

ColorGradientChooser.prototype = Object.create(Element.prototype);

ColorGradientChooser.prototype.updateValues = function()
{
	var self = this;

	this.canvas.width = this.size.x;
	this.canvas.height = this.size.y;

	var context = this.canvas.getContext("2d");
	var gradient = context.createLinearGradient(0, 0, this.canvas.width, 0);

	var width = 1 / (this.values.length - 1);
	for(var i = 0, x = 0; i < this.values.length; i++, x += width)
	{
		gradient.addColorStop(x, this.values[i].getStyle());

		var button = document.createElement("div");
		button.style.position = "absolute";
		button.style.top = "0px";
		button.style.left = (x * 100) + "%";
		button.style.width = "20px";
		button.style.height = "100%";
		button.style.cursor = "pointer";
		button.onchange = function()
		{
			if(self.onChange !== null)
			{
				self.onChange();
			}
		};
		this.buttons.appendChild(button);

		var color = new jscolor(button);
		color.backgroundColor = Editor.theme.boxColor;
		color.insetColor = Editor.theme.boxColor;
		color.shadow = false;
		color.borderWidth = 0;
		color.borderRadius = 0;
		color.zIndex = 2000;
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