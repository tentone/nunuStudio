"use strict";

function ObjectMovedAction(object, newParent, newIndex)
{
	this.object = object;

	this.oldParent = object.parent;
	this.oldIndex = -1;

	this.newParent = newParent;
	this.newIndex = newIndex;
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
