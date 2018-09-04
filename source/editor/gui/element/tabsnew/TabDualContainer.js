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
TabDualContainer.prototype.getActiveTab = function()
{
	var active = [];

	if(this.elementA instanceof TabGroup)
	{
		var tab = this.elementA.getActiveTab();
		if(tab !== null)
		{
			active.push(tab);
		}
	}
	else
	{
		active = active.concat(this.elementA.getActiveTab());
	}

	if(this.elementB instanceof TabGroup)
	{
		var tab = this.elementB.getActiveTab();
		if(tab !== null)
		{
			active.push(tab);
		}
		this.elementA.getActiveTab();
	}
	else
	{
		active = active.concat(this.elementB.getActiveTab());
	}

	return active;
};

//Close actual tab if it's closeable
TabDualContainer.prototype.closeActual = function()
{
	//TODO <USE GROUP ON FOCUS>

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
	//TODO <USE GROUP ON FOCUS>

	this.elementA.selectNextTab();
	this.elementB.selectNextTab();
};

//Select previous tab
TabDualContainer.prototype.selectPreviousTab = function()
{
	//TODO <USE GROUP ON FOCUS>

	this.elementA.selectPreviousTab();
	this.elementB.selectPreviousTab();
};

//Add new option to tab group
TabDualContainer.prototype.addTab = function(TabConstructor, closeable)
{
	//TODO <USE GROUP ON FOCUS>

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
