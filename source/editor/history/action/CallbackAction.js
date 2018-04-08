"use strict";

//Contains an action and a callback function called on change
function CallbackAction(action, callback)
{
	Action.call(this);

	this.action = action;
	this.callback = callback;
}

CallbackAction.prototype.apply = function()
{
	this.action.apply();
	this.callback();
};

CallbackAction.prototype.revert = function()
{
	this.action.revert();
	this.callback();
};
