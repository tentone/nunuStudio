"use strict";

function RemoveResourceAction(resource, category, manager)
{
	Action.call(this);
	
	this.resource = resource;
	this.manager = manager;
	this.category = category;
}

RemoveResourceAction.prototype.apply = function()
{
	this.manager.removeRes(this.resource, this.category);
};

RemoveResourceAction.prototype.revert = function()
{
	this.manager.addRes(this.resource, this.category);
};

RemoveResourceAction.updateGUI = function()
{
	Editor.gui.assetExplorer.updateObjectsView();
};