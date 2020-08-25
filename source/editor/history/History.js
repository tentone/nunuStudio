import {Action} from "./action/Action.js";

/**
 * Manages the history state of multiple objects.
 *
 * @class History
 * @param {number} limit Maximum actions stored in the object.
 */
function History(limit)
{
	this.actions = [];

	this.position = -1;
	this.limit = limit !== undefined ? limit : 50;
}

/**
 * Get action from its id.
 * 
 * @method getAction
 * @param {number} id Action identifier.
 * @return {Action} The action requested, if it is not found returns null.
 */
History.prototype.getAction = function(id)
{
	for (var i = 0; i < this.actions.length; i++)
	{
		if (this.actions[i].id === id)
		{
			return this.actions[i];
		}
	}

	return null;
};

/**
 * Add an Action to the history.
 *
 * @method add
 * @param {Actions} action Actions that represent the change.
 * @param {EditorScreen} editor Editor instance for the action to update status of.
 */
History.prototype.add = function(action, editor)
{	
	// If there are more recent changes remove them
	while (this.actions.length > this.position + 1)
	{
		this.actions.pop();
	}

	// Add action to list
	this.actions.push(action);
	this.position++;

	// Apply action
	action.apply(editor, true);

	// Limit actions size
	while (this.actions.length > this.limit)
	{
		this.actions.splice(0, 1);
		this.position = this.actions.length - 1;
	}
};

/**
 * Revert last action
 *
 * @method undo
 * @param {EditorScreen} editor Editor instance for the action to update status of.
 */
History.prototype.undo = function(editor)
{
	if (this.actions.length > 0 && this.position >= 0)
	{
		var action = this.actions[this.position];
		action.revert(editor, true);

		this.position--;
		
		return action;
	}

	return null;
};

/**
 * Redo last reverted action.
 *
 * @method redo
 * @param {EditorScreen} editor Editor instance for the action to update status of.
 */
History.prototype.redo = function(editor)
{
	if (this.position < this.actions.length - 1)
	{
		this.position++;

		var action = this.actions[this.position];
		action.apply(editor, true);

		return action;
	}

	return null;
};

export {History};
