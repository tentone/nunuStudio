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
	console.warn("nunuStudio: TODO implement updateMetadata.");
};

//Update all tab object views
TabContainer.prototype.updateObjectsView = function()
{
	console.warn("nunuStudio: TODO implement updateObjectsView.");
};

//Update all tab object views
TabContainer.prototype.updateSelection = function()
{
	console.warn("nunuStudio: TODO implement updateSelection.");
};

//Update all tab object views
TabContainer.prototype.updateSettings = function()
{
	console.warn("nunuStudio: TODO implement updateSettings.");
};

//Get actual tab
TabContainer.prototype.getActual = function()
{
	console.warn("nunuStudio: TODO implement getActual.");
};

//Close actual tab if its closeable
TabContainer.prototype.closeActual = function()
{
	console.warn("nunuStudio: TODO implement closeActual.");
};

//Select tab
TabContainer.prototype.selectTab = function(tab)
{
	console.warn("nunuStudio: TODO implement selectTab.");
};

//Select next tab
TabContainer.prototype.selectNextTab = function()
{
	console.warn("nunuStudio: TODO implement selectNextTab.");
};

//Select previous tab
TabContainer.prototype.selectPreviousTab = function()
{
	console.warn("nunuStudio: TODO implement selectPreviousTab.");
};

//Add new option to tab group
TabContainer.prototype.addTab = function(TabConstructor, closeable)
{
	console.warn("nunuStudio: TODO implement addTab.");
};

//Get tab from tab type and attached object is there is any
TabContainer.prototype.getTab = function(type, obj)
{
	console.warn("nunuStudio: TODO implement getTab.");
};

//Attach tab to this group and remove it from the original group
TabContainer.prototype.attachTab = function(tab, insertIndex)
{
	console.warn("nunuStudio: TODO implement attachTab.");
};

//Remove tab from group
TabContainer.prototype.removeTab = function(index)
{
	console.warn("nunuStudio: TODO implement removeTab.");
};

//Remove all tabs
TabContainer.prototype.clear = function(forceAll)
{
	console.warn("nunuStudio: TODO implement clear.");
};
