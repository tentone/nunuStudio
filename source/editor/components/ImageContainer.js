import {Component} from "./Component.js";

/**
 * Container for DOM image element.
 * 
 * @class ImageContainer
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
class ImageContainer extends Component {
	constructor(parent) {
	super(parent, "img");

	this.element.style.borderStyle = "none";
	this.element.style.objectFit = "contain"; // contain | cover | fill
	}

/**
 * Set image from URL or source content.
 * 
 * @method setImage
 * @param {string} source Image URL.
 */
	setImage(source) {
	this.element.src = source;
	}

}

export {ImageContainer};
