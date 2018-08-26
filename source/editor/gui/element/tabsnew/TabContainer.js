"use strict";

/**
 * Tab container is the root for a tree of tab groups.
 *
 * The container keeps track of all groups that may be splited into multiple groups.
 */
function TabContainer()
{
	Element.call(this, parent, "div");
	
	this.tab = null;
}

TabContainer.prototype = Object.create(Element.prototype);

TabContainer.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.tab.position.set(0, 0);
	this.tab.size.copy(this.size);
	this.tab.updateInterface();
};