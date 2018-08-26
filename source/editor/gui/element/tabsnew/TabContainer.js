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
TabContainer.prototype.updateMetadata = function(){};

//Update all tab object views
TabContainer.prototype.updateObjectsView = function(changes){};

//Update all tab object views
TabContainer.prototype.updateSelection = function(){};

//Update all tab object views
TabContainer.prototype.updateSettings = function(){};

//Get actual tab
TabContainer.prototype.getActual = function(){};

//Close actual tab if its closeable
TabContainer.prototype.closeActual = function(){};

//Select tab
TabContainer.prototype.selectTab = function(tab){};

//Select next tab
TabContainer.prototype.selectNextTab = function(){};

//Select previous tab
TabContainer.prototype.selectPreviousTab = function(){};

//Add new option to tab group
TabContainer.prototype.addTab = function(TabConstructor, closeable){};

//Get tab from tab type and attached object is there is any
TabContainer.prototype.getTab = function(type, obj){};

//Attach tab to this group and remove it from the original group
TabContainer.prototype.attachTab = function(tab, insertIndex){};

//Remove tab from group
TabContainer.prototype.removeTab = function(index, dontDestroy){};

//Remove all tabs
TabContainer.prototype.clear = function(forceAll){};
