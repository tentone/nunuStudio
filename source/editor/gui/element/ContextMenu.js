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
	Element.call(this, parent);

	this.element.style.overflow = "visible";
	this.element.style.zIndex = "300";

	this.offset = new THREE.Vector2(20, 10);
	this.options = [];

	var self = this;

	//Mouse leave
	this.element.onmouseleave = function()
	{
		self.destroy();
	};
}

ContextMenu.prototype = Object.create(Element.prototype);

/**
 * Set the text of this context menu.
 * 
 * @method setText
 * @param {String} text
 */
ContextMenu.prototype.setText = function(text)
{
	this.text.setText(text);
};

/**
 * Remove option from context menu.
 *
 * @method removeOption
 * @param {Number} index
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
 * @param {String} name of the option
 * @param {Function} callback Callback function
 */
ContextMenu.prototype.addOption = function(name, callback)
{
	var button = new ButtonMenu(this.element);
	button.element.style.zIndex = "10000";
	button.text.setText(name);
	button.text.setAlignment(Text.LEFT);
	button.text.position.x = 25;

	var self = this;
	button.setCallback(function()
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
 * @param {String} name of the option.
 * @return {DropdownMenu} The new menu created.
 */
ContextMenu.prototype.addMenu = function(name)
{
	var menu = new DropdownMenu(this.element);
	menu.setText(name);
	menu.setLocation(DropdownMenu.LEFT);
	menu.showArrow();
	menu.text.setAlignment(Text.LEFT);
	menu.text.position.x = 25;

	this.options.push(menu);

	return menu;
};

ContextMenu.prototype.updateInterface = function()
{
	if(this.visible)
	{
		//Options
		for(var i = 0; i < this.options.length; i++)
		{
			this.options[i].visible = this.visible;
			this.options[i].size.copy(this.size);
			this.options[i].position.set(0, this.size.y * i);
			this.options[i].updateInterface();
		}
	
		//Element
		this.element.style.visibility = "visible";
		this.element.style.top = (this.position.y - this.offset.y) + "px";
		this.element.style.left = (this.position.x - this.offset.x) + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = (this.size.y * this.options.length) + "px";

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
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};
