"use strict";

function RemoveResourceAction(resource, category, manager)
{
	Action.call(this);
	
	this.resource = resource;
	this.category = category;
	this.manager = manager;
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