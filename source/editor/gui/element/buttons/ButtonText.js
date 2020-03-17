"use strict";

/**
 * Button with text, inherits all methods available on the Text class.
 * 
 * Used in menu bars, panels, etc.
 *
 * @class ButtonText
 * @extends {Button, Text}
 * @param {Element} parent Parent element.
 */
function ButtonText(parent)
{
	Button.call(this, parent);

	this.element.style.color = Editor.theme.textColor;
	this.element.style.display = "flex";
	
	// Span
	this.span = document.createElement("span");
	this.span.style.overflow = "hidden";
	this.element.appendChild(this.span);

	// Text
	this.text = document.createTextNode("");
	this.span.appendChild(this.text);

	this.setColor(Editor.theme.buttonColor, Editor.theme.buttonOverColor);
	this.allowWordBreak(false);
	this.setVerticalAlignment(Text.CENTER);
	this.setAlignment(Text.CENTER);
}

ButtonText.prototype = Object.create(Button.prototype);
Object.assign(ButtonText.prototype, Text.prototype);
