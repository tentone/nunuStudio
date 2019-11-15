"use strict";

/**
 * Button with text, inherits all methods available on the Text class.
 * 
 * Used in menu bars, panels, etc.
 *
 * @class ButtonDrawer
 * @extends {ButtonImage}
 * @param {Element} parent Parent element.
 */
function ButtonDrawer(parent)
{
	ButtonImage.call(this, parent);

	this.element.style.zIndex = "200";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	this.element.style.overflow = "visible";

	this.panel = new Element(this, "div");
	this.panel.element.style.overflow = "visible";
	this.panel.element.style.backgroundColor = Editor.theme.barColor;
	this.panel.element.style.zIndex = "250";

	/** 
	 * List of the options in this panel.
	 *
	 * @attribute options
	 * @type {Array}
	 */
	this.options = [];

	/**
	 * Number of maximum options per row
	 *
	 * @attribute optionsPerLine
	 * @type {number}
	 */
	this.optionsPerLine = 3;
	
	/**
	 * Size of each option, also affects the size of the panel.
	 *
	 * @attribute optionsSize
	 * @type {THREE.Vector2}
	 */
	this.optionsSize = new THREE.Vector2(40, 40);

	/**
	 * Scale of the inner icon of the options created from the addOption() method.
	 *
	 * @attribute optionsScale
	 * @type {THREE.Vector2}
	 */
	this.optionsScale = new THREE.Vector2(0.7, 0.7);

	/**
	 * Indicates if the button drawer panel is visible.
	 *
	 * @attribute expanded
	 * @type {boolean}
	 */
	this.expanded = false;
	this.setExpanded(false);

	var self = this;

	this.element.onmouseenter = function()
	{
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
		self.setExpanded(true);
	};
	this.element.onmouseleave = function()
	{
		self.element.style.backgroundColor = Editor.theme.buttonColor;
		self.setExpanded(false);
	};

	this.panel.element.onmouseenter = function()
	{
		self.setExpanded(true);
	};
	this.panel.element.onmouseleave = function()
	{
		self.setExpanded(false);
	};
}

ButtonDrawer.prototype = Object.create(ButtonImage.prototype);

ButtonDrawer.prototype.clear = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].destroy();
	}
	
	this.options = [];
};

/**
 * Expand or close the button drawer panel.
 *
 * @method setExpanded
 * @param {boolean} expanded
 */
ButtonDrawer.prototype.setExpanded = function(expanded)
{
	this.expanded = expanded;
	this.panel.element.style.display = this.expanded ? "block" : "none";
};

/** 
 * Insert new option from already created element.
 *
 * @method insertOption
 * @param {Element} Element of the option to be inserted in the drawer
 */
ButtonDrawer.prototype.insertOption = function(element)
{
	element.attachTo(this.panel);
	this.options.push(element);
};


/**
 * Add new option to the menu.
 * 
 * @method addOption
 * @param {string} image
 * @param {Function} callback
 * @param {string} altText
 */
ButtonDrawer.prototype.addOption = function(image, callback, altText)
{
	var self = this;

	var button = new ButtonImage(this.panel);
	button.setImage(image);
	button.setOnClick(function()
	{
		callback();
		self.expanded = false;
		self.updateInterface();
	});

	if(altText !== undefined)
	{
		button.setAltText(altText);
	}

	this.options.push(button);
};

/**
 * Remove an option from the menu.
 *
 * @method removeOption
 * @param {number} index
 */
ButtonDrawer.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
	}
};

/**
 * Updates drawer panel size based on the number of options available.
 * 
 * @method updatePanelSize
 */
ButtonDrawer.prototype.updatePanelSize = function()
{
	var optionsPerLine = (this.options.length < this.optionsPerLine) ? this.options.length : this.optionsPerLine;

	this.panel.size.x = (this.optionsSize.x * optionsPerLine);
	this.panel.size.y = (this.optionsSize.y * (Math.floor((this.options.length - 1) / optionsPerLine) + 1));
	this.panel.updateSize();

	this.panel.position.set(this.optionsSize.x, 0);
	this.panel.updatePosition();
};

/**
 * Update drawer options position and size.
 *
 * Should be called after change in options displacement variables).
 *
 * @method updateOptions
 */
ButtonDrawer.prototype.updateOptions = function()
{
	this.updatePanelSize();

	var optionsPerLine = (this.options.length < this.optionsPerLine) ? this.options.length : this.optionsPerLine;

	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
		this.options[i].position.x = this.optionsSize.x * (i % optionsPerLine);
		this.options[i].position.y = this.optionsSize.y * Math.floor(i / optionsPerLine);
		this.options[i].updateInterface();
	}
};

ButtonDrawer.prototype.updateVisibility = function()
{
	this.element.style.display = this.visible ? "block" : "none";
};
