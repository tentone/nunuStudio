"use strict";

/**
 * Base button class.
 * 
 * @class Button
 * @extends {Element}
 * @param {DOM} parent Parent element.
 */
function Button(parent)
{
	Element.call(this, parent);

	this.element.style.cursor = "pointer";

	this.preventDragEvents();
}

Button.prototype = Object.create(Element.prototype);

/**
 * Set button color.
 * 
 * When mouse is over the button uses the overColor, when the mouse gets outside of the button it uses the base color.
 * 
 * @method setColor
 * @param {String} baseColor CSS color for the button background.
 * @param {String} overColor CSS color for the button when mouse is over it.
 */
Button.prototype.setColor = function(baseColor, overColor)
{
	this.element.style.backgroundColor = baseColor;

	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = overColor;
	};

	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = baseColor;
	};
};

/**
 * Set button callback function.
 *
 * @method setCallback
 * @param {Function} callback Callback function.
 */
Button.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
};
