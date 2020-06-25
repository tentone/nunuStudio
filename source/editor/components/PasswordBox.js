import {Pass} from "../../core/postprocessing/Pass.js";
import {Text} from "./Text.js";
import {TextBox} from "./input/TextBox.js";
import {Component} from "./Component.js";

/**
 * DOM password text input element.
 * 
 * @class PasswordBox
 * @extends {TextBox}
 * @param {Component} parent Parent element.
 */
function PasswordBox(parent)
{
	TextBox.call(this, parent);

	this.element.type = "password";
}

PasswordBox.prototype = Object.create(TextBox.prototype);

export {PasswordBox};