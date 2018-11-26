"use strict";

/**
 * The vector array box represents multiple numeric variables as a vector.
 *
 * @class NumberRow
 * @extends {Element}
 */
function NumberRow(parent)
{
	Element.call(this, parent, "div");

	/**
	 * Array with the values objects.
	 *
	 * Each value object is composed of {label:label, input:input}
	 *
	 * @attribute values
	 * @type {Array}
	 */
	this.values = [];
}

NumberRow.prototype = Object.create(Element.prototype);

/**
 * Set the values step.
 *
 * @method setStep
 * @param {Number} value
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
 * @param {Number} min
 * @param {Number} max
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
 * @param {String} label Label of de attribute.
 * @return {NumberBox} The input number box created for this value.
 */
NumberRow.prototype.addValue = function(label)
{
	//TODO <ADD CODE HERE>
};

NumberRow.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);
	
	var sizeX = Math.round((this.size.x - this.values.length * 15) / this.values.length);
	var sizeY = this.size.y + "px";

	
};
