"use strict";

/**
 * Tab container is the root for a tree of tab groups.
 *
 * The container keeps track of all groups that may be splited into multiple groups.
 */
function TabContainer(parent)
{
	Element.call(this, parent, "div");
	
	this.component = null;
}

TabContainer.prototype = Object.create(Element.prototype);

TabContainer.prototype.attach = function(element)
{
	this.component = element;
	this.component.attachTo(this);
};

TabContainer.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	if(this.component !== null)
	{
		this.component.position.set(0, 0);
		this.component.size.copy(this.size);
		this.component.updateInterface();
	}
};

//Update all tabs object data
TabContainer.prototype.updateMetadata = function()
{
	this.component.updateMetadata();
};

//Update all tab object views
TabContainer.prototype.updateObjectsView = function()
{
	this.component.updateObjectsView();
};

//Update all tab object views
TabContainer.prototype.updateSelection = function()
{
	this.component.updateSelection();
};

//Update all tab object views
TabContainer.prototype.updateSettings = function()
{
	this.component.updateSettings();
};

//Get actual tab
TabContainer.prototype.getActual = function()
{
	return this.component.getActual();
};

//Close actual tab if its closeable
TabContainer.prototype.closeActual = function()
{
	this.component.closeActual();
};

//Select tab
TabContainer.prototype.selectTab = function(tab)
{
	this.component.selectTab(tab);
};

//Select next tab
TabContainer.prototype.selectNextTab = function()
{
	this.component.selectNextTab();
};

//Select previous tab
TabContainer.prototype.selectPreviousTab = function()
{
	this.component.selectPreviousTab();
};

//Add new option to tab group
TabContainer.prototype.addTab = function(TabConstructor, closeable)
{
	return this.component.addTab(TabConstructor, closeable);
};

//Get tab from tab type and attached object is there is any
TabContainer.prototype.getTab = function(type, obj)
{
	return this.component.getTab(type, obj);
};

//Attach tab to this group and remove it from the original group
TabContainer.prototype.attachTab = function(tab, insertIndex)
{
	return this.component.attachTab(tab, insertIndex);
};

//Remove tab from group
TabContainer.prototype.removeTab = function(index, dontDestroy)
{
	return this.component.removeTab(index, dontDestroy);
};

//Remove all tabs
TabContainer.prototype.clear = function(forceAll)
{
	this.component.clear();
};
