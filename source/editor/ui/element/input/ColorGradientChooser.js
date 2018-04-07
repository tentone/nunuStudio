"use strict";

function ColorGradientChooser(parent)
{
	Element.call(this, parent);

	this.onChange = null;

	this.values = [];
	this.buttons = [];

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
}

ColorGradientChooser.prototype = Object.create(Element.prototype);

ColorGradientChooser.prototype.updateValues = function()
{
	while(this.buttons.length > 0)
	{
		this.element.removeChild(this.buttons.shift().button);
	}

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
		button.index = i;
		this.element.appendChild(button);

		var color = new jscolor(button);
		color.backgroundColor = Editor.theme.boxColor;
		color.insetColor = Editor.theme.boxColor;
		color.shadow = false;
		color.borderWidth = 0;
		color.borderRadius = 0;
		color.zIndex = 2000;
		this.buttons.push({button:button, color:color});

		button.onchange = function()
		{
			console.log("Change");

			var rgb = self.buttons[this.index].color.rgb;

			self.values[this.index].setRGB(rgb[0]/255, rgb[1]/255, rgb[2]/255);
			self.updateValues();

			if(self.onChange !== null)
			{
				self.onChange();
			}
		};
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

ColorGradientChooser.prototype.updateInterface = function()
{
	Element.prototype.updateInterface.call(this);

	this.canvas.width = this.size.x;
	this.canvas.height = this.size.y;
};