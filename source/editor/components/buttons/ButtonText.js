"use strict";

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

	this.setStyle("color", "var(--color-light)");
	this.setStyle("display", "flex");
	
	this.span = document.createElement("span");
	this.span.style.overflow = "hidden";
	this.element.appendChild(this.span);

	this.text = document.createTextNode("");
	this.span.appendChild(this.text);

	this.allowWordBreak(false);
	this.setVerticalAlignment(Text.CENTER);
	this.setAlignment(Text.CENTER);
}

ButtonText.prototype = Object.create(Button.prototype);
Object.assign(ButtonText.prototype, Text.prototype);
