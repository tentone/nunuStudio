"use strict";

/**
 * A button that can be toggled on and off and keeps its state stored internally.
 *
 * Can be used as a base for other buttons that share the same toggle logic.
 * 
 * @class ButtonToggle
 * @extends {Button}
 * @param {Component} parent Parent element.
 */
function ButtonToggle(parent)
{
	Button.call(this, parent);

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
	this.styleSelected = {backgroundColor: "var(--color-red)"};

	var self = this;

	this.addEvent("click", function()
	{
		self.setSelected(!self.selected);
	});

	this.replaceEvent("mouseleave", function()
	{
		if(!self.disabled)
		{
			if(self.selected)
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

ButtonToggle.prototype = Object.create(Button.prototype);

ButtonToggle.prototype.setSelected = function(value)
{
	this.selected = value;

	if(this.selected)
	{
		this.setStyles(this.styleSelected !== null ? this.styleSelected : this.stylePointerOver);	
	}
};