import {Text} from "../Text.js";
import {Component} from "../Component.js";
import {Button} from "./Button.js";

/**
 * Button with text, inherits all methods available on the Text class.
 * 
 * Used in menu bars, panels, etc.
 *
 * @class ButtonText
 * @extends {Button, Text}
 * @param {Component} parent Parent element.
 */
class ButtonText extends Button {
	constructor(parent) {
	super(parent);

	this.text = new Text(this);
	}

	setText(text) {
	this.text.setText(text);
	}

	updateSize() {
	super.updateSize();

	this.text.size.copy(this.size);
	this.text.updateSize();
	}

}
export {ButtonText};
