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

	this.elements = [];

	//TODO <ADD CODE HERE>
}

VectorArrayBox.prototype = Object.create(Element.prototype);

//Set step for position box
VectorArrayBox.prototype.setStep = function(value)
{
	var value = String(value);
	//this.x.step = value;

	//TODO <ADD CODE HERE>
};

//Set coordinate range
VectorArrayBox.prototype.setRange = function(min, max)
{
 	var min = String(min);
 	var max = String(max);

	//this.x.min = min;
	//this.x.max = max;

	//TODO <ADD CODE HERE>
};

//Get value of position box
VectorArrayBox.prototype.getValue = function()
{
	return {x: parseFloat(this.x.value), y: parseFloat(this.y.value), z: parseFloat(this.z.value), w: parseFloat(this.w.value), order: this.order};
};

//Set value of position box
VectorArrayBox.prototype.setValue = function(x)
{
	//this.x.value = x.x;

	//TODO <ADD CODE HERE>
};

//Set onchange onChange
VectorArrayBox.prototype.setOnChange = function(onChange)
{
	//this.x.onchange = onChange;

	//TODO <ADD CODE HERE>
};

VectorArrayBox.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);
	
	//TODO <ADD CODE HERE>
};
