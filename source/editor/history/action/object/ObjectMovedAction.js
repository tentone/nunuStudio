"use strict";

function ObjectMovedAction(object, parent, index)
{
	this.object = object;

	this.oldParent = object.parent;
	this.oldIndex = -1;

	this.newParent = parent;
	this.newIndex = -1;
}

ObjectMovedAction.prototype.apply = function()
{
	this.oldParent.remove(this.object);
	this.newParent.add(this.object);
};

ObjectMovedAction.prototype.revert = function()
{
	this.newParent.remove(this.object);
	this.oldParent.add(this.object);
};
