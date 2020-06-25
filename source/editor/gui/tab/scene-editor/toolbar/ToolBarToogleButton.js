import {ToolBar} from "./ToolBar.js";
import {Editor} from "../../../../Editor.js";
import {Text} from "../../../../components/Text.js";
import {Component} from "../../../../components/Component.js";
import {ButtonIconToggle} from "../../../../components/buttons/ButtonIconToggle.js";
import {ButtonIcon} from "../../../../components/buttons/ButtonIcon.js";
import {Button} from "../../../../components/buttons/Button.js";

/**
 * Editor tool bar button.
 * 
 * @class ToolBarToogleButton
 * @extends {ButtonIconToggle}
 * @param {Component} parent Parent element.
 */
function ToolBarToogleButton(parent)
{
	ButtonIconToggle.call(this, parent);

	var self = this;

	this.setStyle("borderRadius", "5px");
	this.setStyle("overflow", "visible");

	this.icon.style.left = "25%";
	this.icon.style.top = "25%";
	this.icon.style.width = "50%";
	this.icon.style.height = "50%";

	/** 
	 * Component to display the text on mouse over.
	 *
	 * @attribute text
	 * @type {Text}
	 */
	this.text = new Text(this);
	this.text.setMode(Component.BOTTOM_LEFT);
	this.text.setStyle("backgroundColor", "var(--panel-color)");
	this.text.setStyle("borderRadius", "5px");
	this.text.setTextColor("var(--color-light)");
	this.text.setVisibility(false);
	this.element.onmouseenter = function()
	{	
		self.text.setVisibility(true);
	};
	this.element.onmouseleave = function()
	{
		self.text.setVisibility(false);
	};
}

ToolBarToogleButton.prototype = Object.create(ButtonIconToggle.prototype);

/**
 * Set button text, the text is displayed when mouse passes over the button.
 *
 * @method setText
 * @param {String} text Text to display on mouse over.
 */
ToolBarToogleButton.prototype.setText = function(text)
{
	this.text.setText(text);
};

ToolBarToogleButton.prototype.updateSize = function()
{
	ButtonIcon.prototype.updateSize.call(this);

	this.text.size.set(this.text.measure().x + 20, 30);
	this.text.updateSize();
	this.text.position.set((this.size.x - this.text.size.x) / 2, this.size.y + 2);
	this.text.updatePosition();
};

export {ToolBarToogleButton};