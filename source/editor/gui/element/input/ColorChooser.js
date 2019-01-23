"use strict";

function ColorChooser(parent)
{
	Element.call(this, parent, "input");

	this.element.type = "text";
	this.element.style.outline = "none";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.textIndent = "4px";
	this.element.style.borderRadius = "4px";
	this.element.style.boxShadow = "none";
	this.element.style.MozAppearance = "textfield";
	this.element.style.webkitAppearance = "caret";
	this.element.style.appearance = "textfield";

	/**
	 * Color chooser.
	 *
	 * @attribute color
	 * @type {jscolor}
	 */
	this.color = new jscolor(this.element);
	this.color.backgroundColor = Editor.theme.boxColor;
	this.color.insetColor = Editor.theme.boxColor;
	this.color.shadow = false;
	this.color.borderWidth = 0;
	this.color.borderRadius = 0;
	this.color.zIndex = 2000;

	/**
	 * On change function.
	 *
	 * @attribute onChange
	 * @type {Function}
	 */
	this.onChange = null;
}

ColorChooser.prototype = Object.create(Element.prototype);

/**
 * Set onchange callback, called after changes.
 *
 * @method setOnChange
 * @param {Function} onChange
 */
ColorChooser.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

/**
 * Set value stored in the input element.
 *
 * @method setValue
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 */
ColorChooser.prototype.setValue = function(r, g, b)
{
	this.color.fromRGB(r * 255, g * 255, b * 255);
};

/**
 * Set value from numeric hex.
 *
 * @method setValueHex
 * @param {Number} hex
 */
ColorChooser.prototype.setValueHex = function(hex)
{
	hex = Math.floor(hex);
	this.color.fromRGB(hex >> 16 & 255, hex >> 8 & 255, hex & 255);
};

/**
 * Set value from CSS string.
 *
 * @method setValueString
 * @param {Number} color
 */
ColorChooser.prototype.setValueString = function(color)
{
	this.color.fromString(color);
};

/**
 * Get color value HEX as string.
 *
 * @method getValueString
 * @return {String} String hex color.
 */
ColorChooser.prototype.getValueString = function(color)
{
	return this.color.toHEXString();
};

/**
 * Get color value object.
 *
 * @method getValue
 * @return {Object} Color object.
 */
ColorChooser.prototype.getValue = function()
{
	return {r: this.color.rgb[0] / 255, g: this.color.rgb[1] / 255, b: this.color.rgb[2] / 255};
};

/**
 * Get color value HEX.
 *
 * @method getValueHex
 * @return {Number} Numeric hex color.
 */
ColorChooser.prototype.getValueHex = function()
{
	return (this.color.rgb[0] << 16 ^ this.color.rgb[1] << 8 ^ this.color.rgb[2] << 0);
};
