"use strict";

/**
 * A image button that can be toggled.
 * 
 * @class ButtonImageToggle
 * @extends {ButtonImage}
 * @param {Component} parent Parent element.
 */
function ButtonImageToggle(parent)
{
	ButtonImage.call(this, parent);

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

ButtonImageToggle.prototype = Object.create(ButtonImage.prototype);

/**
 * Set the seleted state of the toggle button.
 * 
 * @method setSelected
 * @param {boolean} selected
 */
ButtonImageToggle.prototype.setSelected = function(selected)
{
	this.selected = selected;
	this.element.style.backgroundColor = this.selected ? Editor.theme.buttonOverColor : Editor.theme.buttonColor;
};

/**
 * Set button callback function.
 *
 * @method setOnClick
 */
ButtonImageToggle.prototype.setOnClick = function(callback)
{
	var self = this;
	this.element.onclick = function()
	{
		self.selected = !self.selected;
		callback();	
	};
};
