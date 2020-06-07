"use strict";

/**
 * Dropdown menu element, used to create dropdowns in menu bars and in context menus.
 * 
 * @class DropdownMenu
 * @extends {Text}
 * @param {Component} parent Parent element.
 */
function DropdownMenu(parent)
{
	Text.call(this, parent);

	this.element.style.backgroundColor = "var(--bar-color)";
	this.element.style.cursor = "pointer";
	this.element.style.pointerEvents = "auto";

	this.preventDragEvents();

	/**
	 * Element, where the options are stored.
	 *
	 * This DOM element is added directly to the parent DOM element.
	 *
	 * @attribute panel
	 * @type {Component}
	 */
	this.panel = new Component(parent, "div");
	this.panel.element.style.overflow = "visible";
	this.panel.element.style.display = "none";
	this.panel.element.style.zIndex = "300";

	/**
	 * Option icon image, the element is only created when a icon is set.
	 *
	 * @attribute icon
	 * @type {Component}
	 */
	this.icon = null;

	/**
	 * Decorative arrow.
	 *
	 * @attribute arrow
	 * @type {Component}
	 */
	this.arrow = document.createElement("img");
	this.arrow.style.display = "none";
	this.arrow.style.position = "absolute";
	this.arrow.style.right = "5px";
	this.arrow.style.top = "3px";
	this.arrow.style.width = "12px";
	this.arrow.style.height = "12px";
	this.arrow.src = Global.FILE_PATH + "icons/misc/arrow_right.png";
	this.element.appendChild(this.arrow);

	/**
	 * Direction to open the dropdown.
	 *
	 * @attribute direction
	 * @type {number}
	 */
	this.direction = DropdownMenu.DOWN;
	
	/**
	 * Indicates if the dropdown menu is expanded.
	 *
	 * @attribute expanded
	 * @type {boolean}
	 */
	this.expanded = false;
	this.optionsSize = new THREE.Vector2(150, 20);

	/**
	 * Options available in the dropdown.
	 *
	 * Options are stored as: {button:button, value:object, name:string}
	 *
	 * @attribute options
	 * @type {Array}
	 */
	this.options = [];

	var self = this;

	this.element.onmouseenter = function()
	{
		self.setExpanded(true);
		self.element.style.backgroundColor = "var(--button-over-color)";
	};

	this.element.onmouseleave = function()
	{
		self.setExpanded(false);
		self.element.style.backgroundColor = "var(--bar-color)";
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

DropdownMenu.DOWN = 0;
DropdownMenu.UP = 1;
DropdownMenu.LEFT = 2;
DropdownMenu.RIGHT = 3;

DropdownMenu.prototype = Object.create(Text.prototype);

/**
 * Set location to where options should open.
 *
 * @method setDirection
 */
DropdownMenu.prototype.setDirection = function(location)
{
	this.direction = location;
};

/**
 * Show arrow.
 *
 * @method showArrow
 */
DropdownMenu.prototype.showArrow = function()
{
	this.arrow.style.display = "block";
};

/**
 * Set icon.
 *
 * @method setIcon
 * @param {string} icon Image URL.
 */
DropdownMenu.prototype.setIcon = function(icon)
{
	if(this.icon === null)
	{
		this.icon = document.createElement("img");
		this.icon.style.display = "block";
		this.icon.style.position = "absolute";
		this.icon.style.left = "5px";
		this.icon.style.top = "3px";
		this.icon.style.width = "12px";
		this.icon.style.height = "12px";
		this.element.appendChild(this.icon);
	}

	this.icon.src = icon;
};

/**
 * Remove option from menu.
 *
 * @method removeOption
 * @param {number} index
 */
DropdownMenu.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
	}
};

/**
 * Add new option to menu
 *
 * @method addOption
 * @param {string} name of the option
 * @param {Function} callback Callback function
 * @param {string} icon Icon URL.
 * @return {ButtonMenu} Button created for the new option.
 */
DropdownMenu.prototype.addOption = function(name, callback, icon)
{
	var button = new ButtonMenu(this.panel);
	button.element.style.zIndex = "200";
	button.setText(name);
	button.setAlignment(Text.LEFT);
	button.position.set(25, 0);

	var self = this;
	button.setOnClick(function()
	{
		callback();
		self.setExpanded(false);
	});

	if(icon !== undefined)
	{
		button.setIcon(icon);
	}

	this.options.push(button);

	return button;
};

/**
 * Add new menu to menu.
 *
 * @method addOption
 * @param {string} name Name of the option.
 * @param {string} icon Optional icon, image URL.
 * @return {DropdownMenu} The new menu created.
 */
DropdownMenu.prototype.addMenu = function(name, icon)
{
	var menu = new DropdownMenu(this.panel);
	menu.setText(name);
	menu.setDirection(DropdownMenu.LEFT);
	menu.showArrow();
	menu.setAlignment(Text.LEFT);
	menu.setMargin(25);
	
	if(icon !== undefined)
	{
		menu.setIcon(icon);
	}

	this.options.push(menu);

	return menu;
};

/** 
 * Update expanded state, position all options in this dropdown.
 * 
 * @method setExpanded
 * @param {boolean} expanded If true the menu will be expanded.
 */
DropdownMenu.prototype.setExpanded = function(expanded)
{
	this.expanded = expanded;

	if(this.expanded)
	{
		this.panel.element.style.display = "block";

		if(this.direction === DropdownMenu.DOWN)
		{
			this.panel.element.style.top = (this.position.y + this.size.y) + "px";
			this.panel.element.style.left = this.position.x + "px";

			var out = DOMUtils.checkBorder(this.panel);

			if(out.y !== 0)
			{
				this.panel.element.style.top = null;
				this.panel.element.style.bottom = (this.position.y + this.size.y) + "px";
			}
			if(out.x !== 0)
			{
				this.panel.element.style.left = (this.position.x - out.x) + "px"; 
			}
		}
		else if(this.direction === DropdownMenu.UP)
		{
			this.panel.element.style.bottom = (this.position.y + this.size.y) + "px";
			this.panel.element.style.left = this.position.x + "px";

			var out = DOMUtils.checkBorder(this.panel);
			if(out.y !== 0)
			{
				this.panel.element.style.bottom = null;
				this.panel.element.style.top = (this.position.y + this.size.y) + "px";
			}
			if(out.x !== 0)
			{
				this.panel.element.style.left = (this.position.x - out.x) + "px"; 
			}
		}
		else if(this.direction === DropdownMenu.LEFT)
		{
			this.panel.element.style.top = this.position.y + "px";
			this.panel.element.style.left = (this.position.x + this.size.x) + "px";

			var out = DOMUtils.checkBorder(this.panel);
			if(out.x !== 0)
			{
				this.panel.element.style.left = (this.position.x - this.size.x) + "px"; 
			}
			if(out.y !== 0)
			{
				this.panel.element.style.top = (this.position.y - out.y) + "px";
			}
		}
		else if(this.direction === DropdownMenu.RIGHT)
		{
			this.panel.element.style.top = this.position.y + "px";
			this.panel.element.style.left = (this.position.x - this.size.x) + "px";

			var out = DOMUtils.checkBorder(this.panel);
			if(out.x !== 0)
			{
				this.panel.element.style.left = (this.position.x + this.size.x) + "px";
			}
			if(out.y !== 0)
			{
				this.panel.element.style.top = (this.position.y - out.y) + "px";
			}
		}
	}
	else
	{
		this.panel.element.style.display = "none";
	}
};

/**
 * Update all options in the menu.
 * 
 * @method updateOptions
 */
DropdownMenu.prototype.updateOptions = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
		this.options[i].position.set(0, this.optionsSize.y * i);
		this.options[i].updateInterface();
	}

	this.panel.element.style.width = this.size.x + "px";
	this.panel.element.style.height = (this.optionsSize.y * this.options.length) + "px";
};

DropdownMenu.prototype.destroy = function()
{
	Text.prototype.destroy.call(this);

	this.parent.destroy();
};

DropdownMenu.prototype.updateSize = function()
{
	Text.prototype.updateSize.call(this);

	this.updateOptions();
};
