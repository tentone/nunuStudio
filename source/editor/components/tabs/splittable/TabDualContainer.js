import {TabGroup} from "../TabGroup.js";
import {TabComponent} from "../TabComponent.js";
import {DualContainer} from "../../containers/DualContainer.js";

/**
 * Tab dual container is a dual container with tabgroups.
 *
 * @class TabDualContainer
 * @extends {Element, TabDual}
 */
function TabDualContainer(parent)
{
	DualContainer.call(this, parent);

	this.element.style.overflow = "visible";
}

TabDualContainer.prototype = Object.create(DualContainer.prototype);

/**
 * Update all tabs object data.
 *
 * @method updateMetadata
 */
TabDualContainer.prototype.updateMetadata = function()
{
	this.elementA.updateMetadata();
	this.elementB.updateMetadata();
};

/**
 * Update all tab object views.
 *
 * @method updateObjectsView
 */
TabDualContainer.prototype.updateObjectsView = function()
{
	this.elementA.updateObjectsView();
	this.elementB.updateObjectsView();
};

/**
 * Update all tab object selection status.
 * 
 * Should be called after object selection changes.
 *
 * @method updateSelection
 */
TabDualContainer.prototype.updateSelection = function()
{
	this.elementA.updateSelection();
	this.elementB.updateSelection();
};

/**
 * Update all tab settings.
 *
 * Should be called after editor settings are changed.
 *
 * @method updateSettings
 */
TabDualContainer.prototype.updateSettings = function()
{
	this.elementA.updateSettings();
	this.elementB.updateSettings();
};

/**
 * Get an array with all the tabs currently active.
 *
 * @method getActiveTab
 * @return {Array} Active tabs.
 */
TabDualContainer.prototype.getActiveTab = function()
{
	var active = [];

	if (this.elementA instanceof TabGroup)
	{
		var tab = this.elementA.getActiveTab();
		if (tab !== null)
		{
			active.push(tab);
		}
	}
	else
	{
		active = active.concat(this.elementA.getActiveTab());
	}

	if (this.elementB instanceof TabGroup)
	{
		var tab = this.elementB.getActiveTab();
		if (tab !== null)
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

/**
 * Close the tab that is currently being shown if it is closeable.
 *
 * @method closeActual
 */
TabDualContainer.prototype.closeActual = function()
{
	if (!(this.elementA instanceof TabGroup) || this.elementA.focused)
	{
		this.elementA.closeActual();
	}

	if (!(this.elementB instanceof TabGroup) || this.elementB.focused)
	{
		this.elementB.closeActual();
	}
};

/**
 * Select a specific tab from the container tab tree.
 *
 * @method selectTab
 * @param {TabComponent} tab Tab to select.
 */
TabDualContainer.prototype.selectTab = function(tab)
{
	this.elementA.selectTab(tab);
	this.elementB.selectTab(tab);
};

/**
 * Select next tab from the currently focused tab group.
 *
 * @method selectNextTab
 */
TabDualContainer.prototype.selectNextTab = function()
{
	if (!(this.elementA instanceof TabGroup) || this.elementA.focused)
	{
		this.elementA.selectNextTab();
	}

	if (!(this.elementB instanceof TabGroup) || this.elementB.focused)
	{
		this.elementB.selectNextTab();
	}
};

/**
 * Select previous tab from the currently focused tab group.
 *
 * @method selectPreviousTab
 */
TabDualContainer.prototype.selectPreviousTab = function()
{
	if (!(this.elementA instanceof TabGroup) || this.elementA.focused)
	{
		this.elementA.selectPreviousTab();
	}

	if (!(this.elementB instanceof TabGroup) || this.elementB.focused)
	{
		this.elementB.selectPreviousTab();
	}
};

/**
 * Add new option to tab group.
 *
 * Prefer the tab group stored on the elementA.
 *
 * @method addTab
 * @param {Constructor} TabConstructor Constructor if the TabComponent to be added to the container.
 * @param {boolean} closeable Indicates if the tab can be closed.
 */
TabDualContainer.prototype.addTab = function(TabConstructor, closeable)
{
	var tab = this.elementA.addTab(TabConstructor, closeable);
	if (tab === null)
	{
		tab = this.elementB.addTab(TabConstructor, closeable);
	}

	return tab;
};

/**
 * Get tab from tab type and attached object is there is any.
 *
 * @param {Constructor} type Type of the tab to look for.
 * @param {Object} object Object attached to the tab.
 * @return TabComponent The tab from the type specified that has the object attached to it.
 */
TabDualContainer.prototype.getTab = function(type, object)
{
	var tab = this.elementA.getTab(type, object);
	
	if (tab === null)
	{
		tab = this.elementB.getTab(type, object);
	}

	return tab;
};

/**
 * Remove all tabs from the container.
 * 
 * @method clear
 */
TabDualContainer.prototype.clear = function(forceAll)
{
	this.elementA.clear(forceAll);
	this.elementB.clear(forceAll);
};

export {TabDualContainer};
