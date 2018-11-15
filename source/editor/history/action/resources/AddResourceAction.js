"use strict";

/**
 * Add resource to the manager.
 *
 * images
 * videos
 * audio
 * fonts
 * materials
 * textures
 * geometries
 * resources
 * shapes
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
	else
	{
		this.manager.removeRes(this.resource, this.category);
	}
	
	RemoveResourceAction.updateGUI();
};

AddResourceAction.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};