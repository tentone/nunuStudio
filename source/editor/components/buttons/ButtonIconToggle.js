"use strict";

/**
 * A image button that can be toggled.
 * 
 * @class ButtonIconToggle
 * @extends {ButtonIcon}
 * @param {Component} parent Parent element.
 */
function ButtonIconToggle(parent)
{
	ButtonIcon.call(this, parent);

	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = "var(--bar-color)";

	this.selected = false;

	// Click event
	var self = this;
	this.element.onclick = function()
	{
		self.selected = !self.selected;
	};

	// Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		self.element.style.backgroundColor = "var(--button-over-color)";
	};

	this.element.onmouseleave = function()
	{
		if(!self.selected)
		{
			self.element.style.backgroundColor = "var(--bar-color)";
		}
	};
}

ButtonIconToggle.prototype = Object.create(ButtonIcon.prototype);

/**
 * Set the seleted state of the toggle button.
 * 
 * @method setSelected
 * @param {boolean} selected
 */
ButtonIconToggle.prototype.setSelected = function(selected)
{
	this.selected = selected;
	this.element.style.backgroundColor = this.selected ? "var(--button-over-color)" : "var(--bar-color)";
};

/**
 * Set button callback function.
 *
 * @method setOnClick
 */
ButtonIconToggle.prototype.setOnClick = function(callback)
{
	var self = this;
	this.element.onclick = function()
	{
		self.selected = !self.selected;
		callback();	
	};
};
