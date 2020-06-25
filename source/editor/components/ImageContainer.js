"use strict";

/**
 * Container for DOM image element.
 * 
 * @class ImageContainer
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function ImageContainer(parent)
{
	Component.call(this, parent, "img");

	this.element.style.borderStyle = "none";
	this.element.style.objectFit = "contain"; // contain | cover | fill
}

ImageContainer.prototype = Object.create(Component.prototype);

/**
 * Set image from URL or source content.
 * 
 * @method setImage
 * @param {string} source Image URL.
 */
ImageContainer.prototype.setImage = function(source)
{
	this.element.src = source;
};
