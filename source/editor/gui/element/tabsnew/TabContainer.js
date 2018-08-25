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
