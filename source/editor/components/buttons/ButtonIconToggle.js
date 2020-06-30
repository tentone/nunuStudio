import {Component} from "../Component.js";
import {ButtonToggle} from "./ButtonToggle.js";

/**
 * A image button that can be toggled.
 * 
 * @class ButtonIconToggle
 * @extends {ButtonToggle}
 * @param {Component} parent Parent element.
 */
function ButtonIconToggle(parent)
{
	ButtonToggle.call(this, parent);

	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";

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

ButtonIconToggle.prototype = Object.create(ButtonToggle.prototype);

/**
 * Set button drawer icon.
 *
 * @method setImage
 * @param {string} image Image URL.
 */
ButtonIconToggle.prototype.setImage = function(image)
{
	this.icon.src = image;
};

/**
 * Set icon scale, the icon will be centered.
 *
 * @method setImageScale
 */
ButtonIconToggle.prototype.setImageScale = function(x, y)
{
	this.icon.style.top = ((1 - y) / 2 * 100) + "%";
	this.icon.style.left = ((1 - x) / 2 * 100) + "%";
	this.icon.style.width = (x * 100) + "%";
	this.icon.style.height = (y * 100) + "%";
};

export {ButtonIconToggle};