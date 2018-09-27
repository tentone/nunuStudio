"use strict";

/**
 * DOM image element.
 * 
 * @class Image
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function Image(parent)
{
	Element.call(this, parent, "img");

	this.element.style.borderStyle = "none";
	this.element.style.objectFit = "contain"; //cover | fill
}

Image.prototype = Object.create(Element.prototype);

/**
 * Set image from URL.
 * 
 * @method setImage
 * @param {String} source Image URL.
 */
Image.prototype.setImage = function(source)
{
	this.element.src = source;
};
