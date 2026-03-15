import {Action} from "./Action.js";

/**
 * Contains an action and a callback function called when the action is applied or reverted.
 *
 * The callback method is called after the action has been applied.
 *
 * @class CallbackAction
 * @param {Action} action Base action.
 * @param {Function} callback Callback function.
 */
class CallbackAction {
	constructor(action, callback) {
	Action.call(this);

	this.action = action;
	this.callback = callback;
	}

	apply() {
	this.action.apply();
	this.callback();
	}

	revert() {
	this.action.revert();
	this.callback();
	}

}

export {CallbackAction};
