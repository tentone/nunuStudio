import {MathUtils} from "three";
import {Component} from "../Component.js";
import {TabGroup} from "./TabGroup.js";
import {TabButton} from "./TabButton.js";
import {TabContainer} from "./splittable/TabContainer.js";

/**
 * Tab element is used to create tabbed elements.
 *
 * These are used to implement the main components of the interface (editors, menus, etc).
 *
 * @class TabComponent
 * @extends {Component}
 * @param {Component} parent Parent element.
 * @param {boolean} closeable If false the tab cannot be closed.
 * @param {TabContainer} container Container for this tab.
 * @param {number} index Index of the tab.
 * @param {string} title Title of the tab.
 * @param {string} icon Icon of the tab.
 */
class TabComponent extends Component {
	constructor(parent, closeable, container, index, title, icon) {
	super(parent, "div");

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = "var(--panel-color)";
	this.preventDragEvents();

	/**
	 * Pointer to the group where this tab is.
	 *
	 * @property container
	 * @type {TabGroup}
	 */
	this.container = container;

	/**
	 * UUID of this tab.
	 *
	 * @property uuid
	 * @type {string}
	 */
	this.uuid = MathUtils.generateUUID();

	/**
	 * Index of the tab inside of the container
	 *
	 * @property index
	 * @type {number}
	 */
	this.index = index;

	/**
	 * Pointer to the button associated with this tab.
	 *
	 * @property container
	 * @type {TabButton}
	 */
	this.button = null;

	// Meta
	this.closeable = closeable;
	this.title = title;
	this.icon = icon;

	/**
	 * Indicates if the tab is currently active (on display).
	 *
	 * @property active
	 * @type {boolean}
	 */
	this.active = false;
	}

/**
 * Update tab metadata (name, icon, ...)
 * 
 * Called after applying changes to object.
 * 
 * Called for every tab.
 *
 * @method updateMetadata
 */
	updateMetadata() {}

/**
 * Update tab settings.
 * 
 * Called after settings of the editor are changed.
 * 
 * Called for every tab.
 *
 * @method updateSettings
 */
	updateSettings() {}

/**
 * Update tab values of the gui for the object attached.
 * 
 * Called when properties of objects are changed.
 * 
 * Called only for active tabs.
 *
 * @method updateValues
 */
	updateValues() {}

/**
 * Update tab object view.
 * 
 * Called when objects are added, removed, etc.
 * 
 * Called only for active tabs.
 *
 * @method updateObjectsView
 */
	updateObjectsView() {}

/**
 * Update tab after object selection changed.
 * 
 * Called after a new object was selected.
 * 
 * Called only for active tabs.
 *
 * @method updateSelection
 */
	updateSelection() {}

/**
 * Activate tab.
 * 
 * Called when a tab becomes active (visible).
 *
 * @method activate
 */
	activate() {
	if (this.active === true)
	{
		this.deactivate();
	}
	
	// TODO <IF TAB NEEDS UPDATE IT SHOULD TAKE CARE OF IT>
	if (this.update !== undefined)
	{
		var self = this;

		var update = function()
		{
			if (self.active) 
			{
				self.update();
				requestAnimationFrame(update);
			}
		};

		requestAnimationFrame(update);
	}

	this.active = true;
	}

/**
 * Deactivate tab.
 * 
 * Called when a tab is deactivated or closed.
 *
 * @method deactivate
 */
	deactivate() {
	this.active = false;
	}

/**
 * Generic method to attach object to a tab.
 *
 * Attached object can be edited using the tab.
 *
 * @method attach
 * @param {Object} object
 */
	attach() {}

/**
 * Check if an object or resource is attached to the tab.
 * 
 * Called to check if a tab needs to be closed after changes to objects.
 *
 * @method isAttached
 */
	isAttached() {
	return false;
	}

/**
 * Close the tab element and remove is from the container.
 * 
 * @method close
 */
	close() {
	this.container.removeTab(this);
	}

/**
 * Select this tab.
 * 
 * @method select
 */
	select() {
	this.container.selectTab(this);
	}

/**
 * Check if tab is selected
 *
 * @method isSelected
 * @return {boolean} True if the tab is selected in the container.
 */
	isSelected() {
	return this === this.container.selected;
	}

/**
 * Set icon of the button attached to this tab.
 *
 * The button should have a .setIcon(url) method.
 *
 * @method setIcon
 * @param {string} icon URL of the icon.
 */
	setIcon(icon) {
	this.icon = icon;
	this.button.setIcon(icon);
	}

/**
 * Set text in the button.
 *
 * The button should have a .setName(text) method.
 *
 * @method setName
 * @param {string} text
 */
	setName(text) {
	this.title = text;
	this.button.setName(text);
	}

	destroy() {
	super.destroy();
	
	if (this.button !== null)
	{
		this.button.destroy();
	}
	}

}

export {TabComponent};
