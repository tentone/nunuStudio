"use strict";

/**
 * Base button class.
 * 
 * @class Button
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function Button(parent)
{
	Element.call(this, parent, "div");

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
 * Set button styles, the style can be descriped in a object.
 *
 * Here is an exaple of a style object:
 * {
 * backgroundColor: "#FF0000",
 * color: "#FFFFFF"
 * }
 *
 * @method setColor
 * @param {Object} baseStyle Object with the style to be applied as base.
 * @param {Object} overStyle Object with the style to be applied when mouse is over.
 */
Button.prototype.setStyles = function(baseStyle, overStyle)
{
	for(var i in baseStyle)
	{
		this.element.style[i] = baseStyle[i];
	}

	this.element.onmouseenter = function()
	{
		for(var i in overStyle)
		{
			this.style[i] = overStyle[i];
		}
	};

	this.element.onmouseleave = function()
	{
		for(var i in baseStyle)
		{
			this.style[i] = baseStyle[i];
		}
	};
};
