"use strict";

function TabElement(parent, closeable, container, index, title, icon)
{
	Element.call(this, parent, "div");

	var self = this;

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.panelColor;
	this.preventDragEvents();

	//Meta
	this.closeable = closeable;
	this.title = title;
	this.icon = icon;

	//Button
	this.button = null;

	//Container
	this.uuid = THREE.Math.generateUUID();
	this.active = false;
	this.updating = false;
	this.index = index;
	this.container = container;

	//Focused
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

TabElement.prototype = Object.create(Element.prototype);

/*
 * Update tab metadata (name, icon, ...)
 * Called after applying changes to object.
 * Called for every tab.
 */
TabElement.prototype.updateMetadata = function(){};

/*
 * Update tab settings.
 * Called after settings of the editor are changed.
 * Called for every tab.
 */
TabElement.prototype.updateSettings = function(){};

/*
 * Update tab values of the gui for the object attached.
 * Called when properties of objects are changed.
 * Called only for active tabs.
 */
TabElement.prototype.updateValues = function(){};

/*
 * Update tab object view.
 * Called when objects are added, removed, etc.
 * Called only for active tabs.
 */
TabElement.prototype.updateObjectsView = function(changes){};

/*
 * Update tab after object selection changed.
 * Called after a new object was selected.
 * Called only for active tabs.
 */
TabElement.prototype.updateSelection = function(){};

/*
 * Activate tab.
 * Called when a tab becomes active.
 */
TabElement.prototype.activate = function()
{
	if(this.update !== undefined)
	{
		var self = this;

		var update = function()
		{
			self.update();

			if(self.active)
			{
				requestAnimationFrame(update);
			}
		};

		requestAnimationFrame(update);
	}

	this.active = true;
};

/*
 * Deactivate tab.
 * Called when a tab is deactivated or closed.
 */
TabElement.prototype.deactivate = function()
{
	this.active = false;
};

/*
 * Attach object or resource to tab.
 */
TabElement.prototype.attach = function(object){};

/*
 * Check if an object or resource is attached to the tab.
 * Called to check if a tab needs to be closed after changes to objects.
 */
TabElement.prototype.isAttached = function(object)
{
	return false;
};

//Close tab
TabElement.prototype.close = function()
{
	this.container.removeTab(this);
};

//Selects this tab
TabElement.prototype.select = function()
{
	this.container.selectTab(this);
};

//Check if tab is selected
TabElement.prototype.isSelected = function()
{
	return this === this.container.selected;
};

//Destroy
TabElement.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
	
	this.button.destroy();
};

//Set button icon
TabElement.prototype.setIcon = function(icon)
{
	this.icon = icon;
	this.button.setIcon(icon);
};

//Set button title
TabElement.prototype.setName = function(text)
{
	this.title = text;
	this.button.setName(text);
};
