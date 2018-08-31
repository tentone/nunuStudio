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

/**
 * Get a context from this canvas.
 * 
 * @method getContext
 * @param {String} type Type of context to get "2d", "webgl", etc
 * @return {Object} Context obtained from the canvas.
 */
Canvas.prototype.getContext = function(type)
{
	return this.element.getContext(type);
};

Canvas.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.element.width = this.size.x * window.devicePixelRatio;
	this.element.height = this.size.y * window.devicePixelRatio;
};