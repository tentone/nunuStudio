import {Action} from "./Action.js";

/**
 * Stores a bundle of ordered actions.
 * 
 * Actions are applied in the same order as they were inserted and reverted in inverse order.
 * 
 * @class ActionBundle
 * @extends {Action}
 * @param {Array} actions Array of actions to create the bundle.
 */
class ActionBundle {
	constructor(actions) {
	Action.call(this);

	this.actions = actions;
	}

	apply() {
	for (var i = 0; i < this.actions.length; i++)
	{
		this.actions[i].apply();
	}
	}

	revert() {
	for (var i = 0; i < this.actions.length; i++)
	{
		this.actions[i].revert();
	}
	}

}

export {ActionBundle};
