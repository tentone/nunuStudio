"use strict";

//Object added to another object action.
function ObjectAddedAction(object, parent, index)
{
	Action.call(this);
	
	this.object = object;
	this.index = (index !== undefined) ? index : -1;

	this.parent = parent;
}

ObjectAddedAction.prototype.apply = function()
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

	this.updateGUI();
};

ObjectAddedAction.prototype.revert = function()
{
	this.parent.remove(this.object);

	this.updateGUI();
};

ObjectAddedAction.prototype.updateGUI = function()
{
	Editor.gui.treeView.addObject(this.object, this.parent, this.index);
	//Editor.updateObjectsViewsGUI();
};
