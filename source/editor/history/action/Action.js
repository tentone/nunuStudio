/**
 * Action defines the interface to apply and revert a history state.
 *
 * Actions are inserted and managed by a History object.
 * 
 * @class Action
 */
class Action {
	constructor() {
	this.id = Action._id++;
	}


/** 
 * Apply the action.
 *
 * Change objects, update the editor and send data to server.
 *
 * @method apply
 */
	apply() {}

/** 
 * Revert the action.
 *
 * Change objects, update the editor and send data to server.
 *
 * @method revert
 */
	revert() {}

}

Action._id = 1;

export {Action};
