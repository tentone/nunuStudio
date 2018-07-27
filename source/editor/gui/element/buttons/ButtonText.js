"use strict";

"use strict";

/**
 * Base button class.
 * 
 * @class ButtonText
 * @extends {Button}
 * @param {DOM} parent Parent element.
 */
function ButtonText(parent)
{
	Button.call(this, parent);

	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.color = Editor.theme.textColor;
	
	//Span
	this.span = document.createElement("span");
	this.span.style.whiteSpace = "pre";
	this.element.appendChild(this.span);

	//Text
	this.text = document.createTextNode("");
	this.span.appendChild(this.text);

	this.preventDragEvents();
	this.setColor(Editor.theme.buttonColor, Editor.theme.buttonOverColor);
}

ButtonText.prototype = Object.create(Button.prototype);
Object.assign(ButtonText.prototype, Text.prototype);

/**
 * Set ButtonText text.
 *
 * @method setText
 * @param {String} text Text.
 */
ButtonText.prototype.setText = Text.prototype.setText;

ButtonText.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};