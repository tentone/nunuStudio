import {Color} from "three";
import {Component} from "../Component.js";

function ColorChooser(parent)
{
	Component.call(this, parent, "input");

	this.element.type = "color";
	this.element.style.outline = "none";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.border = "0px solid";
	this.element.style.textIndent = "4px";
	this.element.style.borderRadius = "4px";
	this.element.style.boxShadow = "none";
	this.element.style.MozAppearance = "textfield";
	this.element.style.webkitAppearance = "caret";
	this.element.style.appearance = "textfield";

	/**
	 * On change callback function automatically called everytime that the color is changed.
	 *
	 * @attribute onChange
	 * @type {Function}
	 */
	this.onChange = null;
}

ColorChooser.prototype = Object.create(Component.prototype);

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
 * @param {number} r Red color channel, if a Color value is received it is used instead.
 * @param {number} g Green color channel.
 * @param {number} b Blue color channel.
 */
ColorChooser.prototype.setValue = function(r, g, b)
{
	if (r instanceof Color)
	{
		this.element.value = "#" + r.getHexString();
	}
	else
	{
		var c = new Color(r, g, b);
		this.element.value = "#" + c.getHexString();
	}
};

/**
 * Set value from numeric hex.
 *
 * @method setValueHex
 * @param {number} hex
 */
ColorChooser.prototype.setValueHex = function(hex)
{
	hex = Math.floor(hex);

	var c = new Color(hex);
	this.element.value = "#" + c.getHexString();
};

/**
 * Set value from CSS string.
 *
 * @method setValueString
 * @param {number} color
 */
ColorChooser.prototype.setValueString = function(color)
{
	this.element.value = color;
};

/**
 * Get color value HEX as string.
 *
 * @method getValueString
 * @return {string} String hex color.
 */
ColorChooser.prototype.getValueString = function(color)
{
	return this.element.value;
};

/**
 * Get color value object.
 *
 * @method getValue
 * @return {Color} Color object.
 */
ColorChooser.prototype.getValue = function()
{
	var c = new Color();
	c.setStyle(this.element.value);
	return c;
};

/**
 * Get color value HEX.
 *
 * @method getValueHex
 * @return {number} Numeric hex color.
 */
ColorChooser.prototype.getValueHex = function()
{
	var c = new Color();
	c.setStyle(this.element.value);
	return c.getHex();
};

export {ColorChooser};
