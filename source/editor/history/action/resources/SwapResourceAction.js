"use strict";

/**
 * Swap resource in the resource manager. The new resource is used to replace the old one.
 *
 * Usages of the old resource are replaced with the new one as well.
 *
 * @class SwapResourceAcation
 * @param {Resource} oldResource Resource to remove.
 * @param {Resource} newResource Resource to add.
 * @param {ResourceManager} manager Manager to insert the resource into.
 * @param {String} category Category of the resource.
 */
function SwapResourceAcation(oldResource, newResource, manager, category)
{
	Action.call(this);
	
	this.oldResource = oldResource;
	this.newResource = newResource;
	this.manager = manager;
	this.category = category;
}

SwapResourceAcation.prototype.apply = function()
{	
	ResourceUtils.swapResource(this.manager, this.category, this.oldResource, this.newResource);
	
	SwapResourceAcation.updateGUI();
};

SwapResourceAcation.prototype.revert = function()
{
	ResourceUtils.swapResource(this.manager, this.category, this.newResource, this.oldResource);

	if(this.resource.dispose !== undefined)
	{
		this.resource.dispose();
	}

	RemoveResourceAction.updateGUI();
};

SwapResourceAcation.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};