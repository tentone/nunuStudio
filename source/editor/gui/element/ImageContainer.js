"use strict";

/**
 * DOM image element.
 * 
 * @class ImageContainer
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function ImageContainer(parent)
{
	Element.call(this, parent, "img");

	this.element.style.borderStyle = "none";
	this.element.style.objectFit = "contain"; // contain | cover | fill
}

ImageContainer.prototype = Object.create(Element.prototype);

/**
 * Set image from URL.
 * 
 * @method setImage
 * @param {string} source Image URL.
 */
ImageContainer.prototype.setImage = function(source)
{
	this.element.src = source;
};
