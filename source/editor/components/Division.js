import {Component} from "./Component.js";

/**
 * DOM division element container.
 * 
 * @class Division
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
class Division extends Component {
	constructor(parent) {
	super(parent, "div");

	this.element.style.overflow = "visible";
}
}

export {Division};
