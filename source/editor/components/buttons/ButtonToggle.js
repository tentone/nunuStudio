import {Component} from "../Component.js";
import {Button} from "./Button.js";

/**
 * A button that can be toggled on and off and keeps its state stored internally.
 *
 * Can be used as a base for other buttons that share the same toggle logic.
 * 
 * @class ButtonToggle
 * @extends {Button}
 * @param {Component} parent Parent element.
 */
class ButtonToggle extends Button {
	constructor(parent) {
	super(parent);

	/**
	 * Indicates if the toggle button is currently selected.
	 *
	 * @attribute selected
	 * @type {boolean}
	 */
	this.selected = false;

	/**
	 * Style to be used when the button is selected. If set to null the over style is used.
	 *
	 * @attribute styleSelected
	 */
	this.styleSelected = {backgroundColor: "var(--button-over-color)"};

	var self = this;

	this.addEvent("click", function()
	{
		self.setSelected(!self.selected);
	});

	this.replaceEvent("mouseleave", function()
	{
		if (!self.disabled)
		{
			if (self.selected)
			{
				self.setStyles(self.styleSelected !== null ? self.styleSelected : self.stylePointerOver);
			}
			else
			{
				self.setStyles(self.styleBase);
			}
		}
	});
	}

/**
 * Set the selected state of the toggle button.
 *
 * @param {boolean} value Selected state of the button.
 */
	setSelected(value) {
	this.selected = value;

	if (this.selected)
	{
		this.setStyles(this.styleSelected !== null ? this.styleSelected : this.stylePointerOver);	
	}
	else
	{
		this.setStyles(this.styleBase);
	}
	}

}
export {ButtonToggle};
