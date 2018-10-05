"use strict";

/*
images
videos
audio
fonts
materials
textures
geometries
resources
shapes
*/
function AddResourceAction(resource, category, manager)
{
	Action.call(this);
	
	this.resource = resource;
	this.manager = manager;
	this.category = category;
}

AddResourceAction.prototype.apply = function()
{
	this.manager.addRes(this.resource, this.category);
	AddResourceAction.updateGUI();
};

AddResourceAction.prototype.revert = function()
{
	this.manager.removeRes(this.resource, this.category);
	AddResourceAction.updateGUI();
};

AddResourceAction.updateGUI = function()
{
	Editor.gui.assetExplorer.updateObjectsView();
};