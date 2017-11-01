"use strict";

//Stores change on one object attribute
function ChangeAction(object, attribute, newValue)
{
	Action.call(this);

	this.object = object;
	this.attribute = attribute;
	this.newValue = newValue;
	this.oldValue = object[attribute];
}

ChangeAction.prototype.apply = function()
{
	this.object[this.attribute] = this.newValue;
};

ChangeAction.prototype.revert = function()
{
	this.object[this.attribute] = this.oldValue;
};
