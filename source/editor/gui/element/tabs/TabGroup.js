"use strict";

/**
 * A tab group contains and manages tab elements.
 *
 * The group is also responsible for creating and managing the lifecycle of its tab elements.
 * 
 * @class TabGroup
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function TabGroup(parent, placement)
{
	Element.call(this, parent, "div");

	var self = this;

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.preventDragEvents();
	
	//Buttons
	this.buttons = new Division(this);
	this.buttons.element.style.backgroundColor = Editor.theme.barColor;
	this.buttons.element.ondrop = function(event)
	{
		event.preventDefault();

		var uuid = event.dataTransfer.getData("uuid");
		var tab = DragBuffer.get(uuid);

		if(tab instanceof TabElement)
		{
			self.attachTab(tab);
			DragBuffer.pop(uuid);
		}
	};

	//Tab
	this.tab = new Division(this);

	//Empty message
	this.empty = document.createElement("div");
	this.empty.style.position = "absolute";
	this.empty.style.textAlign = "center";
	this.empty.style.display = "none";
	this.empty.style.width = "100%";
	this.empty.style.height = "100%";
	this.empty.style.flexDirection = "column";
	this.empty.style.justifyContent = "center";
	this.empty.style.pointerEvents = "none";
	this.empty.appendChild(document.createTextNode(Locale.openTabToEditContent));
	this.element.appendChild(this.empty);

	/**
	 * Currently selected tab.
	 *
	 * @property selected
	 * @type {TabElement}
	 */
	this.selected = null;
	
	/**
	 * Base size of the buttons in this group.
	 * 
	 * Size may be ajusted to fit the available space.
	 *
	 * @property buttonSize
	 * @type {THREE.Vector2}
	 */
	this.buttonSize = new THREE.Vector2(150, 22);

	/**
	 * Tab buttons placement.
	 *
	 * @property placement
	 * @type {Number}
	 */
	this.placement = placement !== undefined ? placement : TabGroup.TOP;
	this.setPlacement(this.placement);

	/**
	 * Tab elements attache to this group.
	 * 
	 * @type {Array}
	 */
	this.options = [];

	/**
	 * Indicates if the tab is currently on focus.
	 *
	 * @property focused
	 * @type {Boolean}
	 */
	this.focused = false;

	this.element.onmouseenter = function()
	{
		self.focused = true;
	};
	this.element.onmouseleave = function()
	{
		self.focused = false;
	};
}

TabGroup.TOP = 0;
TabGroup.BOTTOM = 1;
TabGroup.LEFT = 2;
TabGroup.RIGHT = 3;

TabGroup.prototype = Object.create(Element.prototype);

/**
 * Update all tabs object data.
 *
 * @method updateMetadata
 */
TabGroup.prototype.updateMetadata = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateMetadata();
	}
};

/**
 * Update all tab object views.
 *
 * @method updateMetadata
 */
TabGroup.prototype.updateObjectsView = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateObjectsView();
	}
};

//Attach tab to this group and remove it from the original group
TabGroup.prototype.attachTab = function(tab, insertIndex)
{	
	//Remove from old group
	tab.container.removeTab(tab.index, true);
	
	//Attach to this group
	tab.container = this;
	tab.button.attachTo(this.buttons);
	tab.attachTo(this.tab);
	
	//Add to options
	if(insertIndex !== undefined)
	{
		tab.index = insertIndex;
		this.options.splice(insertIndex, 0, tab);
	}
	else
	{
		tab.index = this.options.length;
		this.options.push(tab);
	}

	//Select the tab if none selected
	if(this.selected === null)
	{
		this.selectTab(tab);
	}
	
	this.updateOptionIndex();
	this.updateInterface();

	return tab;
};

//Move tab from position to another
TabGroup.prototype.moveTabIndex = function(origin, destination)
{
	var button = this.options[origin];

	this.options.splice(origin, 1);
	this.options.splice(destination, 0, button);

	this.updateOptionIndex();
	this.updateInterface();
};

//Update all tab object views
TabGroup.prototype.updateSelection = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateSelection();
	}
};

//Update all tab object views
TabGroup.prototype.updateSettings = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateSettings();
	}
};

//Get actual tab
TabGroup.prototype.getActiveTab = function()
{
	if(this.selected !== null)
	{
		return this.selected;
	}

	return null;
};

//Close actual tab if its closeable
TabGroup.prototype.closeActual = function()
{
	if(this.selected !== null && this.selected.closeable)
	{
		this.selected.deactivate();
		this.removeTab(this.selected);
	}
};

/** 
 * Select tab to set active on this group.
 *
 * If not valid tab is selected the actual selection will be cleared.
 *
 * @method selectTab
 * @param {TabElement} tab TabElement to be selected or index in the tab array.
 */
TabGroup.prototype.selectTab = function(tab)
{
	if(this.selected !== null)
	{
		this.selected.deactivate();
	}

	//Tab as a TabElement object
	if(tab instanceof TabElement)
	{
		this.selected = tab;
		this.selected.activate();
	}
	//Tab as a index
	else if(typeof tab === "number" && tab > -1 && tab < this.options.length)
	{
		this.selected = this.options[tab];
		this.selected.activate();
	}
	else
	{
		this.selected = null;
	}

	this.empty.style.display = this.selected === null ? "flex" : "none";
	this.updateInterface();
};

/**
 * Select next tab.
 *
 * @method selectNextTab
 */
TabGroup.prototype.selectNextTab = function()
{
	if(this.options.length > 0)
	{
		this.selectTab((this.selected.index + 1) % this.options.length);
	}
};

/**
 * Select previous tab.
 *
 * @method selectPreviousTab
 */
TabGroup.prototype.selectPreviousTab = function()
{
	if(this.options.length > 0)
	{
		if(this.selected.index === 0)
		{
			this.selectTab(this.options.length - 1);
		}
		else
		{
			this.selectTab(this.selected.index - 1);
		}
	}
};

/**
 * Add new option to tab group.
 *
 * @method addtab
 */
TabGroup.prototype.addTab = function(TabConstructor, closeable)
{
	var tab = new TabConstructor(this.tab, closeable, this, this.options.length);
	tab.button = new TabButton(this.buttons, tab);
	this.options.push(tab);
	
	if(this.selected === null || this.options.length === 1)
	{
		this.selectTab(tab);
	}
	else
	{
		this.updateInterface();
	}

	return tab;
};

/**
 * Get tab from tab type and attached object is there is any.
 *
 * @method getTab
 * @param {Constructor} type Type of tab to look for.
 * @param {Object} obj Object attached to the tab.
 */
TabGroup.prototype.getTab = function(type, obj)
{
	for(var i = 0; i < this.options.length; i++)
	{
		if(this.options[i] instanceof type)
		{
			if(obj === undefined || this.options[i].isAttached(obj))
			{
				return this.options[i];
			}
		}
	}

	return null;
};

/**
 * Remove tab from group.
 *
 * @method removeTab
 * @param {Number} index Index of tab to look for.
 * @param {Boolean} dontDestroy If true the element is not destroyed.
 */
TabGroup.prototype.removeTab = function(index, dontDestroy)
{	
	//If index is an object get the actual index
	if(typeof index === "object")
	{
		index = this.options.indexOf(index);
	}

	//Check if the index is in range
	if(index > -1 && index < this.options.length)
	{
		var tab = this.options[index];

		if(dontDestroy !== true)
		{
			tab.destroy();
		}

		this.options.splice(index, 1);
		this.updateOptionIndex();

		//Select option
		if(this.selected === tab)
		{
			if(this.options.length > 0)
			{
				this.selectTab(index !== 0 ? index - 1 : 0);
			}
			else
			{
				this.selectTab(null);
			}
		}
		else 
		{
			this.selectTab(null);
		}

		return tab;
	}

	return null;
};

/**
 * Remove all closable tabs from the group.
 *
 * @method clear
 * @param {Boolean} forceAll Remove also the not closable tabs.
 */
TabGroup.prototype.clear = function(forceAll)
{
	if(forceAll === true)
	{
		while(this.options.length > 0)
		{
			this.options.pop().destroy();
		}

		this.selectTab(null);
	}
	else
	{
		var i = 0;
		while(i < this.options.length)
		{
			if(this.options[i].closeable)
			{
				this.options[i].destroy();
				this.options.splice(i, 1);
			}
			else
			{
				i++;
			}
		}

		//Check is selected tab is still available
		var index = this.options.indexOf(this.selected);
		if(index === -1 && this.options.length > 0)
		{
			this.selectTab(0);
		}
	}
};

/**
 * Update index variable stored in the tabs.
 *
 * @method updateOptionIndex
 */
TabGroup.prototype.updateOptionIndex = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].index = i;
	}
};

/**
 * Set the tab group buttons placement.
 *
 * @method setPlacement
 * @param {Number} placement
 */
TabGroup.prototype.setPlacement = function(placement)
{
	this.placement = placement;
};

TabGroup.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	var tabSize = this.size.clone();
	var buttonSize = this.buttonSize.clone();
	var offset = this.buttonSize.clone();

	//Calculate size of the buttons and offset
	if(this.placement === TabGroup.TOP || this.placement === TabGroup.BOTTOM)
	{
		if(buttonSize.x * this.options.length > this.size.x)
		{
			buttonSize.x = this.size.x / this.options.length;
			offset.x = buttonSize.x;
		}
		tabSize.y -= this.buttonSize.y;
		offset.y = 0;
	}
	else if(this.placement === TabGroup.LEFT || this.placement === TabGroup.RIGHT)
	{
		if(buttonSize.y * this.options.length > this.size.y)
		{
			buttonSize.y = this.size.y / this.options.length;
			offset.y = buttonSize.y;
		}
		tabSize.x -= this.buttonSize.x;
		offset.x = 0;
	}
	
	//Update tab and buttons
	for(var i = 0; i < this.options.length; i++)
	{
		var tab = this.options[i];
		tab.visible = this.selected === tab;
		tab.size.copy(tabSize);
		tab.updateInterface();

		var button = tab.button;
		button.size.copy(buttonSize);
		button.position.copy(offset);
		button.position.multiplyScalar(i);
		button.updateInterface();
	}

	this.tab.size.copy(tabSize);
	this.tab.updateSize();

	//Position buttons and tab division
	if(this.placement === TabGroup.TOP)
	{	
		this.buttons.position.set(0, 0);
		this.buttons.updatePosition();
		this.buttons.size.set(this.size.x, this.buttonSize.y);
		this.buttons.updateSize();

		this.tab.position.set(0, this.buttonSize.y);
		this.tab.updatePosition();
	}
	else if(this.placement === TabGroup.BOTTOM)
	{
		this.buttons.position.set(0, this.size.y - this.buttonSize.y);
		this.buttons.updatePosition();
		this.buttons.size.set(this.size.x, this.buttonSize.y);
		this.buttons.updateSize();

		this.tab.position.set(0, 0);
		this.tab.updatePosition();
	}
	else if(this.placement === TabGroup.LEFT)
	{
		this.buttons.position.set(0, 0);
		this.buttons.updatePosition();
		this.buttons.size.set(this.buttonSize.x, this.size.y);
		this.buttons.updateSize();
		
		this.tab.position.set(this.buttonSize.x, 0);
		this.tab.updatePosition();
	}
	else if(this.placement === TabGroup.RIGHT)
	{
		this.buttons.position.set(this.size.x - this.buttonSize.x, 0);
		this.buttons.updatePosition();
		this.buttons.size.set(this.buttonSize.x, this.size.y);
		this.buttons.updateSize();

		this.tab.position.set(0, 0);
		this.tab.updatePosition();
	}
};
