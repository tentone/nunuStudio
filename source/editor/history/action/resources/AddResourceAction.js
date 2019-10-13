"use strict";

/**
 * Add resource to the resource manager.
 *
 * @class AddResourceAction
 * @param {Resource} resource Resource to add.
 * @param {ResourceManager} manager Manager to insert the resource into.
 * @param {String} category Category of the resource.
 */
function AddResourceAction(resource, manager, category)
{
	Action.call(this);
	
	this.resource = resource;
	this.manager = manager;
	this.category = category;
}

AddResourceAction.prototype.apply = function()
{
	ResourceUtils.addResource(this.manager, this.resource, this.category);
	
	AddResourceAction.updateGUI();
};

AddResourceAction.prototype.revert = function()
{
	ResourceUtils.removeResource(this.manager, this.resource, this.category);

	if(this.resource.dispose !== undefined)
	{
		this.resource.dispose();
	}

	RemoveResourceAction.updateGUI();
};

AddResourceAction.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};