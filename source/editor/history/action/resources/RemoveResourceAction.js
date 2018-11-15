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

RemoveResourceAction.prototype.revert = function()
{
	this.manager.addRes(this.resource, this.category);

	AddResourceAction.updateGUI();
};

RemoveResourceAction.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};