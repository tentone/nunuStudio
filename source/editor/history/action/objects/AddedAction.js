"use strict";

//Object added to another object action.
function AddedAction(object, parent, index)
{
	Action.call(this);
	
	this.object = object;
	this.index = (index !== undefined) ? index : -1;

	this.parent = parent;
}

AddedAction.prototype.apply = function()
{
	if(this.index !== -1)
	{
		this.parent.children.splice(this.index, 0, this.object);
		this.object.parent = this.parent;
	}
	else
	{
		this.parent.add(this.object);
		this.index = this.parent.children.indexOf(this.object);
	}

	AddedAction.updateGUI(this.object, this.parent, this.index);
};

AddedAction.prototype.revert = function()
{
	this.parent.remove(this.object);

	RemovedAction.updateGUI(this.object, this.parent);
};

AddedAction.updateGUI = function(object, parent, index)
{
	Editor.gui.treeView.addObject(object, parent, index);

	ResourceManager.retrieveResources(object, Editor.program);
	Editor.gui.assetExplorer.updateObjectsView();
};
