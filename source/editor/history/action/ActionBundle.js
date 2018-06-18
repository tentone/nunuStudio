"use strict";

/**
 * Stores a bundle of ordered actions.
 * 
 * Actions are applied in the same order as they were inserted and reverted in inverse order.
 * 
 * @class ActionBundle
 * @extends {Action}
 * @param {Array} actions Array of actions to create the bundle.
 */
function ActionBundle(actions)
{
	Action.call(this);

	this.actions = actions;
}

ActionBundle.prototype.apply = function()
{
	for(var i = 0; i < this.actions.length; i++)
	{
		this.actions[i].apply();
	}
};

ActionBundle.prototype.revert = function()
{
	for(var i = 0; i < this.actions.length; i++)
	{
		this.actions[i].revert();
	}
};
