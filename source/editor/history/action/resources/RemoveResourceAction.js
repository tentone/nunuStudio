"use strict";

/**
 * Remove a resource from the manager.
 *
 * Usages of the resource being removed are replaced with a default resource of the same category.
 *
 * @class RemoveResourceAction
 * @param {Resource} resource Resource to remove.
 * @param {ResourceManager} manager Manager to insert the resource into.
 * @param {string} category Category of the resource.
 */
function RemoveResourceAction(resource, manager, category)
{
	Action.call(this);
	
	this.resource = resource;
	this.category = category;
	this.manager = manager;
}

RemoveResourceAction.prototype.apply = function()
{
	ResourceCrawler.removeResource(this.manager, this.resource, this.category);

	if(this.resource.dispose !== undefined)
	{
		this.resource.dispose();
	}

	RemoveResourceAction.updateGUI();
};

RemoveResourceAction.prototype.revert = function()
{
	ResourceCrawler.addResource(this.manager, this.resource, this.category);

	AddResourceAction.updateGUI();
};

RemoveResourceAction.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};