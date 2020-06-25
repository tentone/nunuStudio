import {Image} from "../../../core/resources/Image.js";
import {Text} from "../Text.js";
import {Component} from "../Component.js";
import {ButtonText} from "../buttons/ButtonText.js";
import {Button} from "../buttons/Button.js";

/**
 * Button used in dropdown menus, context menus, etc.
 * 
 * The button has text and its possible to add a icon.
 *
 * @class ButtonMenu
 * @extends {ButtonText}
 * @param {Component} parent Parent element.
 */
function ButtonMenu(parent)
{
	ButtonText.call(this, parent);

	this.text.span.style.textIndent = "25px";

	/**
	 * Icon DOM element displayed on the left side of the button.
	 *
	 * @attribute icon
	 * @type {Element}
	 */
	this.icon = null;
}

ButtonMenu.prototype = Object.create(ButtonText.prototype);

/**
 * Set button icon image URL.
 *
 * Creates the element if it still doesnt exist.
 *
 * @method setIcon
 * @param {string} icon Image URL.
 */
ButtonMenu.prototype.setIcon = function(icon)
{
	if(this.icon === null)
	{
		this.icon = document.createElement("img");
		this.icon.style.position = "absolute";
		this.icon.style.display = "block";
		this.icon.style.left = "5px";
		this.icon.style.top = "3px";
		this.icon.style.width = "12px";
		this.icon.style.height = "12px";
		this.element.appendChild(this.icon);
	}
	
	this.icon.src = icon;
};

export {ButtonMenu};