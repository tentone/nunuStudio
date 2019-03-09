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

	//Panel
	this.panel = new Element(parent, "div");
	this.panel.element.style.overflow = "visible";
	this.panel.element.style.backgroundColor = Editor.theme.barColor;
	this.panel.element.style.zIndex = "250";

	//Attributes
	this.panelSize = new THREE.Vector2(0, 0);
	this.panelPosition = new THREE.Vector2(0, 0);

	//Options
	this.options = [];
	this.optionsPerLine = 3;
	this.optionsSize = new THREE.Vector2(40, 40);
	this.optionsScale = new THREE.Vector2(0.7, 0.7);
	this.optionsSpacing = new THREE.Vector2(3, 3);
	this.expanded = false;

	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		self.expanded = true;
		self.updateInterface();
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.style.backgroundColor = Editor.theme.buttonColor;
	};

	this.panel.element.onmouseenter = function()
	{
		self.expanded = true;
		self.updateInterface();
	};

	this.panel.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
	};

	this.updatePanelSize();
}

ButtonDrawer.prototype = Object.create(ButtonImage.prototype);

ButtonDrawer.prototype.destroy = function()
{
	ButtonImage.prototype.destroy.call(this);

	this.parent.destroy();
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

	/*this.updatePanelSize();
	element.size.set(this.optionsSize.x, this.optionsSize.y);
	element.position.x = this.optionsSize.x * ((this.options.length - 1) % this.optionsPerLine);
	element.position.y = this.optionsSize.y * Math.floor((this.options.length - 1) / this.optionsPerLine);
	element.updateInterface();*/
};


/**
 * Add new option to the menu.
 * 
 * @method addOption
 * @param {String} image
 * @param {Function} callback
 * @param {String} altText
 */
ButtonDrawer.prototype.addOption = function(image, callback, altText)
{
	var button = new ButtonImage(this.panel);
	button.setImage(image);

	//Alt text
	if(altText !== undefined)
	{
		button.setAltText(altText);
	}

	//Button callback
	var self = this;
	button.setOnClick(function()
	{
		callback();
		self.expanded = false;
		self.updateInterface();
	});

	//Add button
	this.options.push(button);

	//Set button
	/*this.updatePanelSize();
	button.size.set(this.optionsSize.x, this.optionsSize.y);
	button.position.x = this.optionsSize.x * ((this.options.length - 1) % this.optionsPerLine);
	button.position.y = this.optionsSize.y * Math.floor((this.options.length - 1) / this.optionsPerLine);
	button.updateInterface();*/
};

/**
 * Remove an option from the menu.
 *
 * @method removeOption
 * @param {Number} index
 */
ButtonDrawer.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
		this.updatePanelSize();
		this.updateInterface();
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

	this.panelSize.x = (this.optionsSize.x * optionsPerLine);
	this.panelSize.y = (this.optionsSize.y * (Math.floor((this.options.length - 1) / optionsPerLine) + 1));
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
	if(this.visible)
	{
		this.element.style.display = "block";
		this.panel.element.style.display = this.expanded ? "block" : "none";
	}
	else
	{
		this.element.style.display = "none";
		this.panel.element.style.display = "none";
	}
};

ButtonDrawer.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	if(this.expanded)
	{
		this.panelPosition.x = this.position.x + this.size.x;
		this.panelPosition.y = this.position.y;
		
		this.panel.element.style.top = this.panelPosition.y + "px";
		this.panel.element.style.left = this.panelPosition.x + "px";
		this.panel.element.style.width = this.panelSize.x + "px";
		this.panel.element.style.height = this.panelSize.y + "px";
	}
};