"use strict";

function ObjectRemovedAction(object, parent)
{
	this.object = object;
	this.parent = (parent !== undefined) ? parent : object.parent;
}

ObjectRemovedAction.prototype.apply = function()
{
	this.parent.remove(this.object);
};

ObjectRemovedAction.prototype.revert = function()
{
	this.parent.add(this.object);
};
