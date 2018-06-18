"use strict";

/**
 * Stores change to one object attribute.
 * 
 * @class ChangeAction
 * @extends {Action}
 * @param {Object} object Object to be changed.
 * @param {String} attribute Name of the attribute.
 * @param {Object} newValue New value for the object attribute.
 * @param {Object} oldValue Optionally we can pass the old value.
 */
function ChangeAction(object, attribute, newValue, oldValue)
{
	Action.call(this);

	this.object = object;
	this.attribute = attribute;
	this.newValue = newValue;
	this.oldValue = (oldValue !== undefined) ? oldValue : object[attribute];
}

ChangeAction.prototype.apply = function()
{
	this.object[this.attribute] = this.newValue;
};

ChangeAction.prototype.revert = function()
{
	this.object[this.attribute] = this.oldValue;
};
