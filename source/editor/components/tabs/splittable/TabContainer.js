import {TabGroup} from "../TabGroup.js";
import {TabComponent} from "../TabComponent.js";
import {Component} from "../../Component.js";
import {TabGroupSplit} from "./TabGroupSplit.js";

/**
 * Tab container is the root for a tree of tab groups.
 *
 * The container keeps track of all groups that may be splited into multiple groups.
 *
 * @class TabContainer
 * @extends {Component}
 */
class TabContainer extends Component {
	constructor(parent) {
	super(parent, "div");
	
	this.group = null;
	}

/**
 * Split this tab group into two new tab groups.
 *
 * @method split
 * @param {number} direction Direction where to insert the new tab.
 * @return {TabGroupSplit} The new created tab group.
 */
	split(direction) {
	return this.group.split(direction);
	}

	attach(element) {
	this.group = element;
	this.group.attachTo(this);
	}

	updateSize() {
	super.updateSize();

	if (this.group !== null)
	{
		this.group.position.set(0, 0);
		this.group.size.copy(this.size);
		this.group.updateInterface();
	}
	}

/**
 * Update all tabs object data.
 *
 * @method updateMetadata
 */
	updateMetadata() {
	this.group.updateMetadata();
	}

/**
 * Update all tab object views.
 *
 * @method updateObjectsView
 */
	updateObjectsView() {
	this.group.updateObjectsView();
	}

/**
 * Update all tab object selection status.
 * 
 * Should be called after object selection changes.
 *
 * @method updateSelection
 */
	updateSelection() {
	this.group.updateSelection();
	}

/**
 * Update all tab settings.
 *
 * Should be called after editor settings are changed.
 *
 * @method updateSettings
 */
	updateSettings() {
	this.group.updateSettings();
	}

/**
 * Get an array with all the tabs currently active.
 *
 * @method getActiveTab
 * @return {Array} Active tabs.
 */
	getActiveTab() {
	var active = [];

	if (this.group instanceof TabGroup)
	{
		var tab = this.group.getActiveTab();
		if (tab !== null)
		{
			active.push(tab);
		}
	}
	else
	{
		active = active.concat(this.group.getActiveTab());
	}

	return this.group.getActiveTab();
	}

/**
 * Close the tab that is currently being shown if it is closeable.
 *
 * @method closeActual
 */
	closeActual() {
	this.group.closeActual();
	}

/**
 * Select a specific tab from the container tab tree.
 *
 * @method selectTab
 * @param {TabComponent} tab Tab to select.
 */
	selectTab(tab) {
	this.group.selectTab(tab);
	}

/**
 * Select next tab from the currently focused tab group.
 *
 * @method selectNextTab
 */
	selectNextTab() {
	this.group.selectNextTab();
	}

/**
 * Select previous tab from the currently focused tab group.
 *
 * @method selectPreviousTab
 */
	selectPreviousTab() {
	this.group.selectPreviousTab();
	}

/**
 * Add new tab to the tab container.
 * 
 * @method addTab
 * @param {Constructor} TabConstructor Constructor if the TabComponent to be added to the container.
 * @param {boolean} closeable Indicates if the tab can be closed.
 */
	addTab(TabConstructor, closeable) {
	return this.group.addTab(TabConstructor, closeable);
	}

/**
 * Get tab from tab type and attached object is there is any.
 *
 * @param {Constructor} type Type of the tab to look for.
 * @param {Object} object Object attached to the tab.
 * @return TabComponent The tab from the type specified that has the object attached to it.
 */
	getTab(type, object) {
	return this.group.getTab(type, object);
	}

/**
 * Remove all tabs from the container.
 * 
 * @method clear
 */
	clear() {
	this.group.clear();
	}

}

export {TabContainer};
