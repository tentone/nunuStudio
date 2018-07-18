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

	ObjectAddedAction.updateGUI(this.object, this.parent, this.index);
};

ObjectAddedAction.prototype.revert = function()
{
	this.parent.remove(this.object);

	ObjectRemovedAction.updateGUI(this.object, this.parent);
};

ObjectAddedAction.updateGUI = function(object, parent, index)
{
	Editor.gui.treeView.addObject(object, parent, index);
};
