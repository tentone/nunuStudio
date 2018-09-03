"use strict";

/**
 * Tab container is the root for a tree of tab groups.
 *
 * The container keeps track of all groups that may be splited into multiple groups.
 *
 * @class TabContainer
 * @extends {Element}
 */
function TabContainer(parent)
{
	Element.call(this, parent, "div");
	
	this.group = null;
}

TabContainer.prototype = Object.create(Element.prototype);

TabContainer.prototype.split = function(direction)
{
	return this.group.split(direction);
};

TabContainer.prototype.attach = function(element)
{
	this.group = element;
	this.group.attachTo(this);
};

TabContainer.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	if(this.group !== null)
	{
		this.group.position.set(0, 0);
		this.group.size.copy(this.size);
		this.group.updateInterface();
	}
};

//Update all tabs object data
TabContainer.prototype.updateMetadata = function()
{
	this.group.updateMetadata();
};

//Update all tab object views
TabContainer.prototype.updateObjectsView = function()
{
	this.group.updateObjectsView();
};

//Update all tab object views
TabContainer.prototype.updateSelection = function()
{
	this.group.updateSelection();
};

//Update all tab object views
TabContainer.prototype.updateSettings = function()
{
	this.group.updateSettings();
};

//Get actual tab
TabContainer.prototype.getActiveTab = function()
{
	return this.group.getActiveTab();
};

//Close actual tab if its closeable
TabContainer.prototype.closeActual = function()
{
	this.group.closeActual();
};

//Select tab
TabContainer.prototype.selectTab = function(tab)
{
	this.group.selectTab(tab);
};

//Select next tab
TabContainer.prototype.selectNextTab = function()
{
	this.group.selectNextTab();
};

//Select previous tab
TabContainer.prototype.selectPreviousTab = function()
{
	this.group.selectPreviousTab();
};

//Add new option to tab group
TabContainer.prototype.addTab = function(TabConstructor, closeable)
{
	return this.group.addTab(TabConstructor, closeable);
};

//Get tab from tab type and attached object is there is any
TabContainer.prototype.getTab = function(type, obj)
{
	return this.group.getTab(type, obj);
};

//Remove all tabs
TabContainer.prototype.clear = function(forceAll)
{
	this.group.clear();
};
