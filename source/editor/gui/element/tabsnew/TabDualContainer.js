"use strict";

function TabDualContainer(parent)
{
	DualContainer.call(this, parent);
}

TabDualContainer.prototype = Object.create(DualContainer.prototype);

//Update all tabs object data
TabDualContainer.prototype.updateMetadata = function()
{
	console.warn("nunuStudio: TODO implement updateMetadata.");
};

//Update all tab object views
TabDualContainer.prototype.updateObjectsView = function()
{
	console.warn("nunuStudio: TODO implement updateObjectsView.");
};

//Update all tab object views
TabDualContainer.prototype.updateSelection = function()
{
	console.warn("nunuStudio: TODO implement updateSelection.");
};

//Update all tab object views
TabDualContainer.prototype.updateSettings = function()
{
	console.warn("nunuStudio: TODO implement updateSettings.");
};

//Get actual tab
TabDualContainer.prototype.getActual = function()
{
	console.warn("nunuStudio: TODO implement getActual.");
};

//Close actual tab if its closeable
TabDualContainer.prototype.closeActual = function()
{
	console.warn("nunuStudio: TODO implement closeActual.");
};

//Select tab
TabDualContainer.prototype.selectTab = function(tab)
{
	console.warn("nunuStudio: TODO implement selectTab.");
};

//Select next tab
TabDualContainer.prototype.selectNextTab = function()
{
	console.warn("nunuStudio: TODO implement selectNextTab.");
};

//Select previous tab
TabDualContainer.prototype.selectPreviousTab = function()
{
	console.warn("nunuStudio: TODO implement selectPreviousTab.");
};

//Add new option to tab group
TabDualContainer.prototype.addTab = function(TabConstructor, closeable)
{
	console.warn("nunuStudio: TODO implement addTab.");
};

//Get tab from tab type and attached object is there is any
TabDualContainer.prototype.getTab = function(type, obj)
{
	console.warn("nunuStudio: TODO implement getTab.");
};

//Attach tab to this group and remove it from the original group
TabDualContainer.prototype.attachTab = function(tab, insertIndex)
{
	console.warn("nunuStudio: TODO implement attachTab.");
};

//Remove tab from group
TabDualContainer.prototype.removeTab = function(index)
{
	console.warn("nunuStudio: TODO implement removeTab.");
};

//Remove all tabs
TabDualContainer.prototype.clear = function(forceAll)
{
	console.warn("nunuStudio: TODO implement clear.");
};
