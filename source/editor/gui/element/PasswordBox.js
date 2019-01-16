"use strict";

/**
 * DOM password text input element.
 * 
 * @class PasswordBox
 * @extends {TextBox}
 * @param {Element} parent Parent element.
 */
function PasswordBox(parent)
{
	TextBox.call(this, parent);

	this.element.type = "password";
}

PasswordBox.prototype = Object.create(TextBox.prototype);
