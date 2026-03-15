import {Editor} from "../Editor.js";
import {Component} from "./Component.js";

/**
 * DOM canvas element.
 * 
 * @class Canvas
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
class Canvas extends Component {
	constructor(parent) {
	super(parent, "canvas");

	this.preventDragEvents();
	}

/**
 * Get a context from this canvas.
 * 
 * @method getContext
 * @param {string} type Type of context to get "2d", "webgl", etc
 * @return {Object} Context obtained from the canvas.
 */
	getContext(type) {
	return this.element.getContext(type);
	}

	updateSize() {
	super.updateSize();

	var pixelRatio = Editor.getPixelRatio();
	
	this.element.width = this.size.x * pixelRatio;
	this.element.height = this.size.y * pixelRatio;
	}

}
export {Canvas};
