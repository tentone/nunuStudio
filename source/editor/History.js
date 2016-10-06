"use strict";

//Stores program changes history
function History()
{
	this.size = 10;
	this.actions = [];
}

//Add change to program history
History.prototype.push = function(object, parent, action)
{
	this.actions.push(new Action(object, parent, action));
}

//Get last change from history
History.prototype.pop = function()
{
	return this.actions.pop();
}

//Revert last action on program
History.prototype.revert = function(program)
{
	var action = this.actions.pop();

	if(action.type === Action.CHANGED)
	{
		//TODO <ADD CODE HERE>
	}
	else if(action.type === Action.REMOVED)
	{
		//TODO <ADD CODE HERE>
	}
	else if(action.type === Action.ADDED)
	{
		//TODO <ADD CODE HERE>
	}
}