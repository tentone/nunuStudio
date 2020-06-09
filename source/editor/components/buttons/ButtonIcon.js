"use strict";

/**
 * Button with a centered icon.
 *
 * @class ButtonIconToggle
 * @extends {Button}
 * @param {Component} parent Parent element.
 */
function ButtonIcon(parent)
{
	Button.call(this, parent);

	/**
	 * Icon of the button displayed in the middle.
	 * 
	 * @attribute icon
	 * @type {Component}
	 */
	this.icon = document.createElement("img");
	this.icon.style.pointerEvents = "none";
	this.icon.style.position = "absolute";
	this.icon.style.top = "15%";
	this.icon.style.left = "15%";
	this.icon.style.width = "70%";
	this.icon.style.height = "70%";
	this.element.appendChild(this.icon);
}

ButtonIcon.prototype = Object.create(Button.prototype);

/**
 * Set button drawer icon.
 *
 * @method setImage
 * @param {string} image Image URL.
 */
ButtonIcon.prototype.setImage = function(image)
{
	this.icon.src = image;
};

/**
 * Set icon scale, the icon will be centered.
 *
 * @method setImageScale
 */
ButtonIcon.prototype.setImageScale = function(x, y)
{
	this.icon.style.top = ((1 - y) / 2 * 100) + "%";
	this.icon.style.left = ((1 - x) / 2 * 100) + "%";
	this.icon.style.width = (x * 100) + "%";
	this.icon.style.height = (y * 100) + "%";
};
