import {Component} from "../Component.js";
import {Color} from "three";

function ColorChooser(parent)
{
	Component.call(this, parent, "input");

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
	 * Color chooser object automatically creates the color selector box.
	 *
	 * @attribute color
	 * @type {jscolor}
	 */
	this.color = new jscolor(this.element);
	this.color.backgroundColor = "var(--box-color)";
	this.color.insetColor = "var(--box-color)";
	this.color.shadow = false;
	this.color.borderWidth = 0;
	this.color.borderRadius = 0;
	this.color.zIndex = 2000;

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
	if(r instanceof Color)
	{
		this.color.fromRGBA(r.r * 255, r.g * 255, r.b * 255, 255)
	}
	else
	{
		this.color.fromRGBA(r * 255, g * 255, b * 255, 255);
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
	this.color.fromRGBA(hex >> 16 & 255, hex >> 8 & 255, hex & 255, 255);
};

/**
 * Set value from CSS string.
 *
 * @method setValueString
 * @param {number} color
 */
ColorChooser.prototype.setValueString = function(color)
{
	this.color.fromString(color);
};

/**
 * Get color value HEX as string.
 *
 * @method getValueString
 * @return {string} String hex color.
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
 * @return {number} Numeric hex color.
 */
ColorChooser.prototype.getValueHex = function()
{
	return (this.color.rgb[0] << 16 ^ this.color.rgb[1] << 8 ^ this.color.rgb[2] << 0);
};

export {ColorChooser};
