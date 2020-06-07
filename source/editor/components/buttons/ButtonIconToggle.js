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
	this.element.style.backgroundColor = Editor.theme.buttonColor;

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
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		if(!self.selected)
		{
			self.element.style.backgroundColor = Editor.theme.buttonColor;
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
	this.element.style.backgroundColor = this.selected ? Editor.theme.buttonOverColor : Editor.theme.buttonColor;
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
