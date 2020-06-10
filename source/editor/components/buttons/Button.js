"use strict";

/**
 * Base button class.
 * 
 * @class Button
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function Button(parent)
{
	Component.call(this, parent, "div");

	this.element.style.cursor = "pointer";

	var disabled = false;
	Object.defineProperties(this,
	{
		/**
		 * If the button is disabled, it cannot be clicked.
		 *
		 * @attribute disabled
		 * @type {boolean}
		 */
		disabled:
		{
			get: function(){return disabled;},
			set: function(value){this.setDisabled(value);}
		}
	});

	/**
	 * Base style of the button shown normally.
	 *
	 * @attribute baseStyle
	 * @type {Object}
	 */
	this.baseStyle = {backgroundColor: "var(--bar-color)"};

	/**
	 * Base style of the button shown when the mouse is over the button.
	 *
	 * @attribute overStyle
	 * @type {Object}
	 */
	this.overStyle = {backgroundColor: "var(--button-over-color)"};

	/**
	 * Disabled style shown when the button is disabled.
	 *
	 * @attribute disabledStyle
	 * @type {Object}
	 */
	this.disabledStyle = {backgroundColor: "var(--color-graph)"};

	this.setStyles(this.baseStyle);
	this.preventDragEvents();

	var self = this;

	this.addEvent("mouseenter", function()
	{
		// TODO <REMOVE THIS>
		console.log("Mouse enter, set style");

		if(!self.disabled)
		{
			self.setStyles(self.overStyle);
		}
	});

	this.addEvent("mouseleave", function()
	{
		if(!self.disabled)
		{
			self.setStyles(self.baseStyle);
		}
	});
}

Button.prototype = Object.create(Component.prototype);

/**
 * Set disabled state of a button element.
 *
 * A disabled button cannot be pressed and does not react to interactions.
 *
 * @method setDisabled
 * @param {boolean} disabled
 */
Button.prototype.setDisabled = function(disabled)
{
	this.disabled = disabled;

	if(this.disabled === true)
	{
		this.setStyles(this.disabledStyle);
	}
	else
	{
		this.setStyles(this.baseStyle);
	}
};

/**
 * Set button styles, the style can be descriped in a object.
 *
 * @method setColor
 * @param {Object} baseStyle Style to be applied as base.
 * @param {Object} overStyle Style to be applied when mouse is over.
 * @param {Object} overStyle Style to be applied when the button is disabled.
 */
Button.prototype.setStyles = function(baseStyle, overStyle, disabledStyle)
{
	this.baseStyle = baseStyle;

	if(overStyle !== undefined)
	{
		this.overStyle = overStyle;
	}

	if(disabledStyle !== undefined)
	{
		this.disabledStyle = disabledStyle;
	}
};
