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
function ButtonText(parent)
{
	Button.call(this, parent);

	this.text = new Text(this);
}

ButtonText.prototype = Object.create(Button.prototype);

ButtonText.prototype.setText = function(text)
{
	this.text.setText(text);
};

ButtonText.prototype.updateSize = function()
{
	Button.prototype.updateSize.call(this);

	this.text.size.copy(this.size);
	this.text.updateSize();
};
export {ButtonText};