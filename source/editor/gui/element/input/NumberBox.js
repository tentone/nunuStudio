"use strict";

/**
 * Number input element.
 * 
 * @class NumberBox
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function NumberBox(parent)
{
	Component.call(this, parent, "input");

	/**
	 * Indicates if the number box is storing a angle value.
	 *
	 * @attribute isAngle
	 * @type {Boolean}
	 */
	this.isAngle = false;

	this.element.type = "number";
	this.element.step = "0.1";
	this.element.style.backgroundColor = Editor.theme.boxColor;
	this.element.style.color = Editor.theme.textColor;
	this.element.style.outline = "none";
	this.element.style.borderStyle = "none";
	this.element.style.boxSizing = "border-box";
	this.element.style.textIndent = "4px";
	this.element.style.borderRadius = "4px";
	this.element.style.boxShadow = "none";
	this.element.style.MozAppearance = "textfield";
	this.element.style.webkitAppearance = "caret";
	this.element.style.appearance = "textfield";
}

NumberBox.prototype = Object.create(Component.prototype);

/**
 * Set the disabled state of the element.
 *
 * @method setDisabled
 * @param {boolean} disabled
 */
NumberBox.prototype.setDisabled = function(disabled)
{
	this.element.disabled = disabled;
};

/**
 * Set number range.
 *
 * @methos setRange
 * @param {number} min
 * @param {number} max
 */
NumberBox.prototype.setRange = function(min, max)
{
	this.element.min = String(min);
	this.element.max = String(max);
};

/**
 * Set number step.
 *
 * @method setStep
 * @param {number} value
 */
NumberBox.prototype.setStep = function(value)
{
	this.element.step = String(value);
};

/**
 * Set onchange callback, called after changes.
 *
 * @method setOnChange
 * @param {Function} onChange
 */
NumberBox.prototype.setOnChange = function(onChange)
{
	this.element.onchange = onChange;
};

/**
 * Set value stored in the input element.
 *
 * @method setValue
 * @param {number} value
 */
NumberBox.prototype.setValue = function(value)
{
	if(this.isAngle && Editor.settings.units.angle === Settings.DEGREE)
	{
		value = UnitConverter.convert(value, "r", "d");
	}

	this.element.value = value;
};

/**
 * Get value stored in the input element.
 *
 * @method setValue
 * @return {Object} Value stored in the input element.
 */
NumberBox.prototype.getValue = function()
{	
	var value = Number.parseFloat(this.element.value);
	if(this.isAngle && Editor.settings.units.angle === Settings.DEGREE)
	{
		value = UnitConverter.convert(value, "d", "r");
	}

	return value;
};

NumberBox.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};