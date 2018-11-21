"use strict";

/**
 * The vector array box represents multiple numeric variables as a vector.
 *
 * @class VectorArrayBox
 * @extends {Element}
 */
function VectorArrayBox(parent)
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

	//TODO <ADD CODE HERE>
}

VectorArrayBox.prototype = Object.create(Element.prototype);

/**
 * Set the values step.
 *
 * @method setStep
 * @param {Number} value
 */
VectorArrayBox.prototype.setStep = function(value)
{
	var value = String(value);

	//this.x.step = value;

	//TODO <ADD CODE HERE>
};

/**
 * Set the values range
 *
 * @method setRange
 * @param {Number} min
 * @param {Number} max
 */
VectorArrayBox.prototype.setRange = function(min, max)
{
 	var min = String(min);
 	var max = String(max);

	//this.x.min = min;
	//this.x.max = max;

	//TODO <ADD CODE HERE>
};

/**
 * Add value to the box
 *
 * @method addValue
 * @param {String} name Name of de attribute.
 */
VectorArrayBox.prototype.addValue = function(name)
{
	//TODO <ADD CODE HERE>
};

/**
 * Get a value from the box.
 *
 * @method getValue
 * @param {String} name Name of de attribute.
 * @return {Object} Value stored in the attribute, null if there is no value.
 */
VectorArrayBox.prototype.getValue = function(name)
{
	//TODO <ADD CODE HERE>

	return null;
};

/**
 * Set value to the box
 *
 * @method setValue
 * @param {String} name Name of de attribute.
 * @param {Object} value Value
 */
VectorArrayBox.prototype.setValue = function(name, value)
{
	//TODO <ADD CODE HERE>
};

/**
 * Set onchange callback, called after changes.
 *
 * @method setOnChange
 * @param {Function} onChange
 */
VectorArrayBox.prototype.setOnChange = function(onChange)
{
	//TODO <ADD CODE HERE>
};

VectorArrayBox.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);
	
	var sizeX = Math.round((this.size.x - this.values.length * 15) / this.values.length);
	var sizeY = this.size.y + "px";
};
