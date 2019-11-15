"use strict";

/**
 * Context menu element.
 * 
 * @class ContextMenu
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function ContextMenu(parent)
{
	Element.call(this, parent, "div");

	var self = this;

	this.element.style.overflow = "visible";
	this.element.style.zIndex = "300";
	this.element.onmouseleave = function()
	{
		self.destroy();
	};

	this.offset = new THREE.Vector2(20, 10);
	
	/**
	 * Options in this menu.
	 * 
	 * @attribute options
	 * @type {Array}
	 */
	this.options = [];
}

ContextMenu.prototype = Object.create(Element.prototype);

/**
 * Set the text of this context menu.
 * 
 * @method setText
 * @param {string} text
 */
ContextMenu.prototype.setText = function(text)
{
	this.text.setText(text);
};

/**
 * Remove option from context menu.
 *
 * @method removeOption
 * @param {number} index
 */
ContextMenu.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
	}
};

/**
 * Add new option to context menu
 *
 * @method addOption
 * @param {string} name of the option
 * @param {Function} callback Callback function
 */
ContextMenu.prototype.addOption = function(name, callback)
{
	var button = new ButtonMenu(this);
	button.element.style.zIndex = "10000";
	button.setText(name);
	button.setAlignment(Text.LEFT);
	button.position.x = 25;

	var self = this;
	button.setOnClick(function()
	{
		callback();
		self.destroy();
	});

	this.options.push(button);
};

/**
 * Add new menu to context menu
 *
 * @method addOption
 * @param {string} name of the option.
 * @return {DropdownMenu} The new menu created.
 */
ContextMenu.prototype.addMenu = function(name)
{
	var menu = new DropdownMenu(this);
	menu.setText(name);
	menu.setDirection(DropdownMenu.LEFT);
	menu.showArrow();
	menu.setAlignment(Text.LEFT);
	menu.setMargin(25);

	this.options.push(menu);

	return menu;
};

/**
 * Update all options in the menu.
 * 
 * @method updateOptions
 */
ContextMenu.prototype.updateOptions = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.copy(this.size);
		this.options[i].position.set(0, this.size.y * i);
		this.options[i].updateInterface();
	}
};

ContextMenu.prototype.updateSize = function()
{
	this.element.style.width = this.size.x + "px";
	this.element.style.height = (this.size.y * this.options.length) + "px";

	this.updateOptions();
};

ContextMenu.prototype.updatePosition = function()
{
	this.element.style.top = (this.position.y - this.offset.y) + "px";
	this.element.style.left = (this.position.x - this.offset.x) + "px";

	//Check if its inside window
	var out = DOMUtils.checkBorder(this.element);
	if(out.x !== 0)
	{
		this.element.style.left = (this.position.x + this.offset.x - this.size.x) + "px"; 
	}
	if(out.y !== 0)
	{
		this.element.style.top = (this.position.y - this.offset.y - out.y) + "px";
	}
};
