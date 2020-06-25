import {Action} from "../Action.js";

/**
 * Contains an action and a callback function called when the action is applied or reverted.
 *
 * The callback method is called after the action has been applied.
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

export {CallbackAction};