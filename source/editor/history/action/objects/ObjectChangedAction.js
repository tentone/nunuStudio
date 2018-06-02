"use strict";

function ObjectChangedAction(object, attribute, newValue, oldValue)
{
	ChangeAction.call(this, object, attribute, newValue, oldValue);
}

ObjectChangedAction.prototype.apply = function()
{
	ChangeAction.prototype.apply.call(this);

	this.updateGUI();
};

ObjectChangedAction.prototype.revert = function()
{
	ChangeAction.prototype.revert.call(this);

	this.updateGUI();
};

ObjectChangedAction.prototype.updateGUI = function()
{
	Editor.updateValuesGUI();
};


