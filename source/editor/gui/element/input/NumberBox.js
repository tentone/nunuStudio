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
	Element.call(this, parent, "input");

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

NumberBox.prototype = Object.create(Element.prototype);

/**
 * Set the disabled state of the element.
 *
 * @method setDisabled
 * @param {Boolean} disabled
 */
NumberBox.prototype.setDisabled = function(disabled)
{
	this.element.disabled = disabled;
};

/**
 * Set number range.
 *
 * @methos setRange
 * @param {Number} min
 * @param {Number} max
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
 * @param {Number} value
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
 * @param {Number} value
 */
NumberBox.prototype.setValue = function(value)
{
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
	return Number.parseFloat(this.element.value);
};

NumberBox.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};