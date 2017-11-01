"use strict";

//Stores changes to an object
function History(program)
{
	this.actions = [];

	this.position = 0;
	this.limit = 10;
}

//Add change to program history
History.prototype.add = function(action)
{	
	this.actions.push(action);
	action.apply();

	if(this.actions.length > this.limit)
	{
		this.actions.pop();
	}
};

//Revert last action
History.prototype.undo = function()
{
	if(this.actions.length > 0)
	{
		var action = this.actions.pop();
		action.revert();
		return true;
	}

	return false;
};

//Redo last reverted action
History.prototype.redo = function()
{
	return false;
};