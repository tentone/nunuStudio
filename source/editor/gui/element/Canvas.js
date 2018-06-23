"use strict";

/**
 * DOM canvas element.
 * 
 * @class Canvas
 * @extends {Element}
 * @param {DOM} parent Parent element.
 */
function Canvas(parent)
{
	Element.call(this, parent, "canvas");

	this.preventDragEvents();
}

Canvas.prototype = Object.create(Element.prototype);

Canvas.prototype.setResolution = function(width, height)
{
	this.element.width = width;
	this.element.height = height;
};

Canvas.prototype.getContext2D = function()
{
	return this.element.getContext("2d");
};

Canvas.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.element.width = this.size.x * window.devicePixelRatio;
	this.element.height = this.size.y * window.devicePixelRatio;
};