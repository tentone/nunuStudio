import {Interface} from "../../../gui/Interface.js";
import {Text} from "../../Text.js";
import {NumberBox} from "../NumberBox.js";
import {Component} from "../../Component.js";

/**
 * The vector array box represents multiple numeric variables as a vector.
 *
 * @class NumberRow
 * @extends {Component}
 */
function NumberRow(parent)
{
	Component.call(this, parent, "div");

	/**
	 * Array with the values objects.
	 *
	 * Each value object is composed of {label:label, input:input}
	 *
	 * @attribute values
	 * @type {Array}
	 */
	this.values = [];

	/**
	 * Label size in px.
	 *
	 * @attribute labelSize
	 * @type {number}
	 */
	this.labelSize = 15;
}

NumberRow.prototype = Object.create(Component.prototype);

/**
 * Set the values step.
 *
 * @method setStep
 * @param {number} value
 */
NumberRow.prototype.setStep = function(value)
{
	var value = String(value);

	for(var i = 0; i < this.values.length; i++)
	{
		this.values[i].input.setStep(value);
	}
};

/**
 * Set the values range
 *
 * @method setRange
 * @param {number} min
 * @param {number} max
 */
NumberRow.prototype.setRange = function(min, max)
{
 	var min = String(min);
 	var max = String(max);

	for(var i = 0; i < this.values.length; i++)
	{
		this.values[i].input.setRange(min, max);
	}
};

/**
 * Add value to the box
 *
 * @method addValue
 * @param {string} label Label of de attribute.
 * @return {NumberBox} The input number box created for this value.
 */
NumberRow.prototype.addValue = function(label)
{
	var input = new NumberBox(this);

	var text = new Text(this);
	text.setText(label);	

	this.values.push(
	{
		label: text,
		input: input
	});

	return input;
};

NumberRow.prototype.updateSize = function()
{
	Component.prototype.updateSize.call(this);
	
	var width = Math.round((this.size.x - this.values.length * this.labelSize) / this.values.length);
	var x = 0;
	
	for(var i = 0; i < this.values.length; i++)
	{
		var label = this.values[i].label;
		label.position.set(x, 0);
		label.size.set(this.labelSize, this.size.y);
		label.updateInterface();

		var input = this.values[i].input;
		input.position.set(x + this.labelSize, 0);
		input.size.set(width, this.size.y);
		input.updateInterface();

		x += width + this.labelSize;
	}
};

export {NumberRow};