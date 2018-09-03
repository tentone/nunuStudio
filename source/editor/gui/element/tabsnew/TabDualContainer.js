"use strict";

/**
 * Tab dual container is a dual container with tabgroups.
 *
 * @class TabDualContainer
 * @extends {Element, TabDual}
 */
function TabDualContainer(parent)
{
	DualContainer.call(this, parent);
}

TabDualContainer.prototype = Object.create(DualContainer.prototype);

//Update all tabs object data
TabDualContainer.prototype.updateMetadata = function()
{
	this.elementA.updateMetadata();
	this.elementB.updateMetadata();
};

//Update all tab object views
TabDualContainer.prototype.updateObjectsView = function()
{
	this.elementA.updateObjectsView();
	this.elementB.updateObjectsView();
};

//Update all tab object views
TabDualContainer.prototype.updateSelection = function()
{
	this.elementA.updateSelection();
	this.elementB.updateSelection();
};

//Update all tab object views
TabDualContainer.prototype.updateSettings = function()
{
	this.elementA.updateSettings();
	this.elementB.updateSettings();
};

//Get actual tab
TabDualContainer.prototype.getActiveTabs = function()
{
	//TODO <ADD CODE HERE>
	
	//this.elementA.getActiveTabs();
	//this.elementB.getActiveTabs();

	return null;
};

//Close actual tab if it's closeable
TabDualContainer.prototype.closeActual = function()
{
	//TODO <ADD CODE HERE>

	//this.elementA.closeActual();
	//this.elementB.closeActual();
};

//Select tab
TabDualContainer.prototype.selectTab = function(tab)
{
	this.elementA.selectTab(tab);
	this.elementB.selectTab(tab);
};

//Select next tab
TabDualContainer.prototype.selectNextTab = function()
{
	//TODO <ADD CODE HERE>

	//this.group.selectNextTab();
};

//Select previous tab
TabDualContainer.prototype.selectPreviousTab = function()
{
	//TODO <ADD CODE HERE>

	//this.group.selectPreviousTab();
};

//Add new option to tab group
TabDualContainer.prototype.addTab = function(TabConstructor, closeable)
{
	var tab = this.elementA.addTab(TabConstructor, closeable);
	if(tab === null)
	{
		tab = this.elementB.addTab(TabConstructor, closeable);
	}

	return tab;
};

//Get tab from tab type and attached object is there is any
TabDualContainer.prototype.getTab = function(type, obj)
{
	var tab = this.elementA.getTab(type, obj);
	if(tab === null)
	{
		tab = this.elementB.getTab(type, obj);
	}

	return tab;
};

//Remove all tabs
TabDualContainer.prototype.clear = function(forceAll)
{
	this.group.clear();
};

//Remove tab from group
TabDualContainer.prototype.removeTab = function(index)
{
	console.warn("nunuStudio: TODO implement removeTab.");
	
	return null;
};

//Remove all tabs
TabDualContainer.prototype.clear = function(forceAll)
{
	this.elementA.clear(forceAll);
	this.elementB.clear(forceAll);
};
