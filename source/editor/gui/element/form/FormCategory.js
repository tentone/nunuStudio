"use strict";

/**
 * A form category represents a section of a form.
 *
 * The category has a title and can be collapse of hidden from the form.
 *
 * It contains the actual form elements.
 * 
 * @class FormCategory
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function FormCategory(parent)
{
	Element.call(this, parent, "div");

	//TODO <ADD CODE HERE>
}

FormCategory.prototype = Object.create(Element.prototype);

/**
 * Set the title of this category.
 *
 * @method setTitle
 * @param {String} title Title of the category.
 */
FormCategory.prototype.setTitle = function(title)
{
	//TODO <ADD CODE HERE>
};

FormCategory.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

};
