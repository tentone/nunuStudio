"use strict";

//Object moved in the object tree.
function ObjectMovedAction(object, newParent, newIndex)
{
	Action.call(this);
	
	this.object = object;

	this.oldParent = object.parent;
	this.oldIndex = this.oldParent.children.indexOf(this.object);

	this.newParent = newParent;
	this.newIndex = newIndex;
}

ObjectMovedAction.prototype.apply = function()
{
	this.oldParent.remove(this.object);
	
	if(this.newIndex === undefined)
	{
		this.newParent.add(this.object);
		this.newIndex = this.newParent.children.indexOf(this.object);
	}
	else
	{
		var children = this.newParent.children;
		children.splice(this.newIndex, 0, this.object);
		this.object.parent = this.newParent;
	}

	ObjectMovedAction.updateGUI(this.object, this.oldParent, this.newParent, this.newIndex);
};

ObjectMovedAction.prototype.revert = function()
{
	this.newParent.remove(this.object);

	var children = this.oldParent.children;
	children.splice(this.oldIndex, 0, this.object);
	this.object.parent = this.oldParent;

	ObjectMovedAction.updateGUI(this.object, this.newParent, this.oldParent, this.oldIndex);
};

ObjectMovedAction.updateGUI = function(object, oldParent, newParent, newIndex)
{
	Editor.gui.treeView.moveObject(object, oldParent, newParent, newIndex);
};


