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
	
	this.element.style.display = "flex";
	this.element.style.pointerEvents = "auto";

	/** 
	 * Span DOM element used to represent the text.
	 *
	 * @attribute span
	 * @type {Element}
 	 */
	this.span = document.createElement("span");
	this.span.style.overflow = "hidden";
	this.element.appendChild(this.span);

	/**
	 * Text DOM node where the text is stored.
	 *
	 * @attribute text
	 * @type {Element}
	 */
	this.text = document.createTextNode("");
	this.span.appendChild(this.text);

	/**
	 * If set to true the text container will automatically fit the text size.
	 *
	 * @attribute fitContent
	 * @type {boolean}
	 */
	this.fitContent = false;

	this.allowWordBreak(false);
	this.setVerticalAlignment(Text.CENTER);
	this.setAlignment(Text.CENTER);
}

ButtonText.prototype = Object.create(Button.prototype);
Object.assign(ButtonText.prototype, Text.prototype);
