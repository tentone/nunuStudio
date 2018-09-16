"use strict";

/**
 * Table form element automatically organizes element into a grid like form.
 * 
 * @class Form
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function Form(parent)
{
	Element.call(this, parent, "div");

	this.categories = [];
}

Form.prototype = Object.create(Element.prototype);

/**
 * Add a element to form (in actual row)-
 *
 * @method add
 */
Form.prototype.addCategory = function(name)
{
	var category = new FormCategory();

	//TODO <ADD CODE HERE>

	return category;
};

Form.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

};
