"use strict";

//Stores a bundle of ordered actions
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
