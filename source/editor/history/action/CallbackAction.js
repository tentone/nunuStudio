"use strict";

/**
 * Contains an action and a callback function called when the action is applied or reverted.
 *
 * @class CallbackAction
 * @param {Action} action Base action.
 * @param {Function} callback Callback function.
 */
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
