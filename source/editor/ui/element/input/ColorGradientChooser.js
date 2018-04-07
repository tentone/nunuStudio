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

ColorGradientChooser.prototype.updateButtons = function()
{
	var self = this;

	function buttonOnChange()
	{
		var rgb = this.color.rgb;

		self.values[this.index].setRGB(rgb[0]/255, rgb[1]/255, rgb[2]/255);
		self.updateValues();

		if(self.onChange !== null)
		{
			self.onChange();
		}
	}

	while(this.buttons.length > this.values.length)
	{
		this.element.removeChild(this.buttons.shift());
	}

	while(this.buttons.length < this.values.length)
	{
		var button = document.createElement("input");
		button.type = "text";
		button.style.display = "block";
		button.style.position = "absolute";
		button.style.top = "0px";
		button.style.width = "20px";
		button.style.height = "100%";
		button.style.cursor = "pointer";
		button.style.borderStyle = "none";
		button.style.boxSizing = "border-box";
		button.style.borderRadius = "2px";
		this.element.appendChild(button);

		var color = new jscolor(button);
		color.backgroundColor = Editor.theme.boxColor;
		color.insetColor = Editor.theme.boxColor;
		color.shadow = false;
		color.borderWidth = 0;
		color.borderRadius = 0;
		color.zIndex = 2000;

		button.onchange = buttonOnChange;
		button.color = color;
		button.index = -1;

		this.buttons.push(button);
	}

	for(var i = 0; i < this.buttons.length; i++)
	{
		this.buttons[i].index = i;
	}
};

ColorGradientChooser.prototype.updateValues = function()
{
	var context = this.canvas.getContext("2d");
	var gradient = context.createLinearGradient(0, 0, this.canvas.width, 0);

	var colorStep = 1 / (this.values.length - 1);
	var colorPercentage = 0;

	var buttonSpacing = (this.size.x - 20) / (this.buttons.length - 1);
	var buttonPosition = 0;

	for(var i = 0; i < this.values.length; i++)
	{
		gradient.addColorStop(colorPercentage, this.values[i].getStyle());

		this.buttons[i].style.left = buttonPosition + "px";

		colorPercentage += colorStep;
		buttonPosition += buttonSpacing;
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

	this.updateButtons();
	this.updateValues();
};

ColorGradientChooser.prototype.getValue = function()
{
	return this.values;
};

ColorGradientChooser.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.canvas.width = this.size.x;
		this.canvas.height = this.size.y;

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