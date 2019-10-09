"use strict";

/**
 * Remove a resource from the manager.
 *
 * @class RemoveResourceAction
 * @param {Resource} resource Resource to remove.
 * @param {ResourceManager} manager Manager to insert the resource into.
 * @param {String} category Category of the resource.
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
	if(this.category === "materials")
	{
		this.manager.removeRes(this.resource, this.category, Editor.defaultMaterial, Editor.defaultSpriteMaterial);
	}
	else if(this.category === "textures")
	{
		this.manager.removeRes(this.resource, this.category, Editor.defaultTexture);
	}
	else if(this.category === "fonts")
	{
		this.manager.removeRes(this.resource, this.category, Editor.defaultFont);
	}
	else if(this.category === "audio")
	{
		this.manager.removeRes(this.resource, this.category, Editor.defaultAudio);
	}
	else if(this.category === "geometries")
	{
		this.manager.removeRes(this.resource, this.category, Editor.defaultGeometry);
	}
	else
	{
		this.manager.removeRes(this.resource, this.category);
	}

	if(this.resource.dispose !== undefined)
	{
		this.resource.dispose();
	}

	RemoveResourceAction.updateGUI();
};

RemoveResourceAction.prototype.revert = function()
{
	this.manager.addRes(this.resource, this.category);

	AddResourceAction.updateGUI();
};

RemoveResourceAction.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};