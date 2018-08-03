"use strict";

/**
 * Button used in dropdown menus, context menus, etc.
 * 
 * The button has text and its possible to add a icon.
 *
 * @class ButtonMenu
 * @extends {ButtonText}
 * @param {DOM} parent Parent element.
 */
function ButtonMenu(parent)
{
	ButtonText.call(this, parent);

	this.span.style.textIndent = "25px";

	/**
	 * Icon element.
	 *
	 * @attribute icon
	 * @type {DOM}
	 */
	this.icon = null;

	this.setColor(Editor.theme.buttonColor, Editor.theme.buttonOverColor);
}

ButtonMenu.prototype = Object.create(ButtonText.prototype);

/**
 * Set button icon image URL.
 *
 * Creates the element if it still doesnt exist.
 *
 * @method setIcon
 * @param {String} icon Image URL.
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
