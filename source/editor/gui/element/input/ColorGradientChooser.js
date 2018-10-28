"use strict";

/**
 * Color gradient chooser is used to select and preview a gradient of colors store in an array.
 *
 * @class ColorGradientChooser
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function ColorGradientChooser(parent)
{
	Element.call(this, parent, "div");

	/**
	 * On change callback function.
	 *
	 * @property onChange
	 * @type {Function}
	 */
	this.onChange = null;

	/**
	 * Color values of the gradient.
	 *
	 * @property values
	 * @type {Array}
	 */
	this.values = [];

	/**
	 * Buttons DOM element. Buttons have a onchange, color and index properties attached to them.
	 *
	 * @property buttons
	 * @type {Array}
	 */
	this.buttons = [];

	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.borderRadius = "4px";
	this.element.style.zIndex = "2000";

	/**
	 * Canvas DOM element used to draw the gradient.
	 *
	 * @property canvas
	 * @type {DOM}
	 */
	this.canvas = document.createElement("canvas");
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	this.canvas.style.width = "100%";
	this.canvas.style.height = "100%";
	this.element.appendChild(this.canvas);
}

ColorGradientChooser.prototype = Object.create(Element.prototype);

/**
 * Update the buttos to match new values.
 *
 * @method updateButtons
 */
ColorGradientChooser.prototype.updateButtons = function()
{
	var self = this;

	function buttonOnChange()
	{
		var rgb = this.color.rgb;

		self.values[this.index].setRGB(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
		self.updateValues();

		if(self.onChange !== null)
		{
			self.onChange(self.values[this.index], this.index);
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
		button.style.width = "15px";
		button.style.height = "100%";
		button.style.cursor = "pointer";
		button.style.outline = "none";
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

/**
 * Update the representation of the gradient.
 *
 * @method updateValues
 */
ColorGradientChooser.prototype.updateValues = function()
{
	var context = this.canvas.getContext("2d");
	var gradient = context.createLinearGradient(0, 0, this.canvas.width, 0);

	var colorStep = 1 / (this.values.length - 1);
	var colorPercentage = 0;

	var buttonSpacing = (this.size.x - 15) / (this.buttons.length - 1);
	var buttonPosition = 0;

	for(var i = 0; i < this.values.length; i++)
	{
		gradient.addColorStop(colorPercentage, this.values[i].getStyle());

		this.buttons[i].color.fromRGB(this.values[i].r * 255, this.values[i].g * 255, this.values[i].b * 255);
		this.buttons[i].style.left = buttonPosition + "px";

		colorPercentage += colorStep;
		buttonPosition += buttonSpacing;
	}

	context.fillStyle = gradient;
	context.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

/**
 * Set onChange callback that receives (value, index) as arguments.
 *
 * @method setOnChange
 * @param {Function} onChange OnChange callback receives value and index as arguments.
 */
ColorGradientChooser.prototype.setOnChange = function(onChange)
{
	this.onChange = onChange;
};

/**
 * Set an array of color values to be displayed on this gradient.
 *
 * @method setValue
 * @param {Array} values
 */
ColorGradientChooser.prototype.setValue = function(values)
{
	this.values = [];

	for(var i = 0; i < values.length; i++)
	{
		var color = new THREE.Color();
		color.copy(values[i]);
		this.values.push(color);
	}

	this.updateButtons();
	this.updateValues();
};

/**
 * Get the values stored in this element.
 *
 * @method getValue
 * @return {Array} Values of the gradient.
 */
ColorGradientChooser.prototype.getValue = function()
{
	return this.values;
};

ColorGradientChooser.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);
	
	this.canvas.width = this.size.x;
	this.canvas.height = this.size.y;

	this.updateValues();
};
