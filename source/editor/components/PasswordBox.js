import {TextBox} from "./input/TextBox.js";
import {Component} from "./Component.js";

/**
 * DOM password text input element.
 * 
 * @class PasswordBox
 * @extends {TextBox}
 * @param {Component} parent Parent element.
 */
class PasswordBox extends TextBox {
	constructor(parent) {
	super(parent);

	this.element.type = "password";
}
}

export {PasswordBox};
