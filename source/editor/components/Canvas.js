import {Editor} from "../Editor.js";
import {Component} from "./Component.js";

/**
 * DOM canvas element.
 * 
 * @class Canvas
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function Canvas(parent)
{
	Component.call(this, parent, "canvas");

	this.preventDragEvents();
}

Canvas.prototype = Object.create(Component.prototype);

/**
 * Get a context from this canvas.
 * 
 * @method getContext
 * @param {string} type Type of context to get "2d", "webgl", etc
 * @return {Object} Context obtained from the canvas.
 */
Canvas.prototype.getContext = function(type)
{
	return this.element.getContext(type);
};

Canvas.prototype.updateSize = function()
{
	Component.prototype.updateSize.call(this);

	var pixelRatio = Editor.getPixelRatio();
	
	this.element.width = this.size.x * pixelRatio;
	this.element.height = this.size.y * pixelRatio;
};
export {Canvas};