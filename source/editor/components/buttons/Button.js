import {Component} from "../Component.js";

/**
 * Base button class.
 * 
 * @class Button
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
class Button extends Component {
	constructor(parent) {
	super(parent, "div");

	this.element.style.cursor = "pointer";

	/**
	 * If the button is disabled, it cannot be clicked.
	 *
	 * @attribute disabled
	 * @type {boolean}
	 */
	var disabled = false;
	Object.defineProperty(this, "disabled",
		{
			get: function() {return disabled;},
			set: function(value) {this.setDisabled(value);}
		});

	/**
	 * Base style of the button shown normally.
	 *
	 * @attribute styleBase
	 * @type {Object}
	 */
	this.styleBase = {backgroundColor: "var(--bar-color)"};

	/**
	 * Base style of the button shown when the mouse is over the button.
	 *
	 * @attribute stylePointerOver
	 * @type {Object}
	 */
	this.stylePointerOver = {backgroundColor: "var(--button-over-color)"};

	/**
	 * Disabled style shown when the button is disabled.
	 *
	 * @attribute styleDisabled
	 * @type {Object}
	 */
	this.styleDisabled = {backgroundColor: "var(--color-graph)"};

	this.setStyles(this.styleBase);
	this.preventDragEvents();

	var self = this;

	this.addEvent("mouseenter", function()
	{
		if (!self.disabled)
		{
			self.setStyles(self.stylePointerOver);
		}
	});

	this.addEvent("mouseleave", function()
	{
		if (!self.disabled)
		{
			self.setStyles(self.styleBase);
		}
	});
	}

/**
 * Set disabled state of a button element.
 *
 * A disabled button cannot be pressed and does not react to interactions.
 *
 * @method setDisabled
 * @param {boolean} disabled
 */
	updateDisabled() {
	if (this.disabled)
	{
		this.setStyles(this.styleDisabled);
	}
	else
	{
		this.setStyles(this.styleBase);
	}
	}

/**
 * Updates the buttons styles can also change them providing new ones as parameters.
 *
 * @method updateSyles
 * @param {Object} styleBase Style to be applied as base.
 * @param {Object} stylePointerOver Style to be applied when mouse is over.
 * @param {Object} styleDisabled Style to be applied when the button is disabled.
 */
	updateSyles(styleBase, stylePointerOver, styleDisabled) {
	if (styleBase !== undefined)
	{
		this.styleBase = styleBase;
	}

	if (stylePointerOver !== undefined)
	{
		this.stylePointerOver = stylePointerOver;
	}

	if (styleDisabled !== undefined)
	{
		this.styleDisabled = styleDisabled;
	}

	this.updateDisabled(this.disabled);
	}

}

export {Button};
