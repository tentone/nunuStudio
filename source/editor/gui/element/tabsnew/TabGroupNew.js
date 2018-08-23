"use strict";

function TabGroupNew(parent)
{
	Element.call(this, parent, "div");

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.preventDragEvents();
	
	//Buttons
	this.buttons = document.createElement("div");
	this.buttons.style.overflow = "hidden";
	this.buttons.style.position = "absolute";
	this.buttons.style.backgroundColor = Editor.theme.buttonColor;
	this.element.appendChild(this.buttons);

	//Tab
	this.tab = document.createElement("div");
	this.tab.style.position = "absolute";
	this.tab.style.overflow = "visible";
	this.element.appendChild(this.tab);

	//Options
	this.mode = TabGroupNew.TOP;
	this.buttonSize = new THREE.Vector2(140, 20);
	this.selected = null;
	
	/**
	 * Tab elements attache to this group.
	 * 
	 * @type {Array}
	 */
	this.options = [];
}

TabGroupNew.TOP = 0;
TabGroupNew.BOTTOM = 1;
TabGroupNew.LEFT = 2;
TabGroupNew.RIGHT = 3;

TabGroupNew.prototype = Object.create(Element.prototype);

/** 
 * Tab split test using a dualcontainer element.
 */
TabGroupNew.prototype.split = function(direction)
{
	var container = new DualContainer(this.parent);
	container.attachA(this);

	var group = new TabGroupNew(container);
	container.attachB(group);

	Editor.gui.tab = container;
	Editor.gui.updateInterface();
};

//TODO
TabGroupNew.prototype.simplify = function()
{
	//TODO <ADD CODE HERE>
};

//Update all tabs object data
TabGroupNew.prototype.updateMetadata = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateMetadata();
	}
};

//Update all tab object views
TabGroupNew.prototype.updateObjectsView = function(changes)
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateObjectsView();
	}
};

//Update all tab object views
TabGroupNew.prototype.updateSelection = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateSelection();
	}
};

//Update all tab object views
TabGroupNew.prototype.updateSettings = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].updateSettings();
	}
};

//Get actual tab
TabGroupNew.prototype.getActual = function()
{
	if(this.selected !== null)
	{
		return this.selected;
	}

	return null;
};

//Close actual tab if its closeable
TabGroupNew.prototype.closeActual = function()
{
	if(this.selected !== null)
	{
		if(this.selected.closeable)
		{
			this.selected.deactivate();
			this.removeTab(this.selected);
		}
	}
};

//Select tab
TabGroupNew.prototype.selectTab = function(tab)
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
		this.updateInterface();
	}
	//Tab as a index
	else if(typeof tab === "number" && tab > -1 && tab < this.options.length)
	{
		this.selected = this.options[tab];
		this.selected.activate();
		this.updateInterface();
	}
	else
	{
		this.selected = null;
	}
};

//Select next tab
TabGroupNew.prototype.selectNextTab = function()
{
	if(this.options.length > 0)
	{
		this.selectTab((this.selected.index + 1) % this.options.length);
	}
};

//Select previous tab
TabGroupNew.prototype.selectPreviousTab = function()
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

//Add new option to tab grounp
TabGroupNew.prototype.addTab = function(TabConstructor, closeable)
{
	var tab = new TabConstructor(this.tab, closeable, this, this.options.length);
	tab.button = new TabButtonNew(this.buttons, tab);

	this.options.push(tab);
	if(this.selected === null)
	{
		this.selectTab(tab);
	}

	return tab;
};

//Get tab from tab type and attached object is there is any
TabGroupNew.prototype.getTab = function(type, obj)
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

//Attach tab to this group and remove it from the original group
TabGroupNew.prototype.attachTab = function(tab, insertIndex)
{
	tab.container.removeTab(tab.index, true);

	tab.container = this;
	tab.button.attachTo(this.buttons);
	tab.attachTo(this.tab);
	
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

	if(this.selected === null)
	{
		this.selectTab(tab);
	}

	this.updateOptionIndex();
	this.updateInterface();

	return tab;
};

//Remove tab from group
TabGroupNew.prototype.removeTab = function(index, dontDestroy)
{	
	//If index is an object get the actual index
	if(index instanceof TabElement)
	{
		index = this.options.indexOf(index);
	}

	//Check if the index is in range
	if(index > -1 && index < this.options.length)
	{
		var tab = this.options[index];

		//Remove option from list
		if(dontDestroy !== true)
		{
			tab.destroy();
		}
		this.options.splice(index, 1);

		//Update tabs index
		this.updateOptionIndex();

		//Select option
		if(this.options.length > 0)
		{
			this.selectTab(index !== 0 ? index - 1 : 0);
		}
		else
		{
			this.selectTab(null);
		}

		return tab;
	}

	return null;
};

//Remove all tabs
TabGroupNew.prototype.clear = function()
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
};

//Move tab from position to another
TabGroupNew.prototype.moveButton = function(origin, destination)
{
	var button = this.options[origin];

	this.options.splice(origin, 1);
	this.options.splice(destination, 0, button);

	this.updateOptionIndex();
	this.updateInterface();
};

//Update tabs index
TabGroupNew.prototype.updateOptionIndex = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].index = i;
	}
};

TabGroupNew.prototype.updateSize = TabGroup.prototype.updateSize;
