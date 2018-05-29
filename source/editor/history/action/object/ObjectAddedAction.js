"use strict";

function ObjectAddedAction(object, parent)
{
	Action.call(this);
	
	this.object = object;
	this.parent = parent;
}

ObjectAddedAction.prototype.apply = function()
{
	this.parent.add(this.object);
};

ObjectAddedAction.prototype.revert = function()
{
	this.parent.remove(this.object);
};
