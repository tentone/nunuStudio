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

/**
 * Split this tab group into two new tab groups.
 *
 * @method split
 * @param {Number} direction Direction where to insert the new tab.
 * @return {TabGroupSplit} The new created tab group.
 */
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
	var active = [];

	if(this.group instanceof TabGroup)
	{
		var tab = this.group.getActiveTab();
		if(tab !== null)
		{
			active.push(tab);
		}
	}
	else
	{
		active = active.concat(this.group.getActiveTab());
	}

	return this.group.getActiveTab();
};

/**
 * Close the tab that is currently being shown if it is closeable.
 *
 * @method closeActual
 */
TabContainer.prototype.closeActual = function()
{
	this.group.closeActual();
};

/**
 * Select a tab from the container tab tree.
 *
 * @method selectTab
 * @param {TabElement} tab Tab to select.
 */
TabContainer.prototype.selectTab = function(tab)
{
	this.group.selectTab(tab);
};

/**
 * Select next tab from the currently focused tab group.
 *
 * @method selectNextTab
 */
TabContainer.prototype.selectNextTab = function()
{
	this.group.selectNextTab();
};

/**
 * Select previous tab from the currently focused tab group.
 *
 * @method selectPreviousTab
 */
TabContainer.prototype.selectPreviousTab = function()
{
	this.group.selectPreviousTab();
};

/**
 * Add new tab to the tab container.
 * 
 * @method addTab
 * @param {Constructor} TabConstructor Constructor if the TabElement to be added to the container.
 * @param {Boolean} closeable Indicates if the tab can be closed.
 */
TabContainer.prototype.addTab = function(TabConstructor, closeable)
{
	return this.group.addTab(TabConstructor, closeable);
};

/**
 * Get tab from tab type and attached object is there is any.
 *
 * @param {Constructor} type Type of the tab to look for.
 * @param {Object} object Object attached to the tab.
 * @return TabElement The tab from the type specified that has the object attached to it.
 */
TabContainer.prototype.getTab = function(type, obj)
{
	return this.group.getTab(type, obj);
};

/**
 * Remove all tabs from the container.
 * 
 * @method clear
 */
TabContainer.prototype.clear = function(forceAll)
{
	this.group.clear();
};
