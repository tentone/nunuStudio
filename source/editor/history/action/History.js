"use strict";

//Stores program changes history
function History(program)
{
	//Program
	this.program = program;

	//Actions list
	this.actions = [];
	this.size = 10;

	//Timestamp
	this.timestamp = 0;
}

//Add change to program history
History.prototype.push = function(action)
{
	this.actions.push(action);

	this.timestamp++;

	if(this.actions.length > this.size)
	{
		this.actions.pop();
	}
};

//Get last change from history
History.prototype.pop = function()
{
	return this.actions.pop();
};

//Revert last action (returns action applied on success)
History.prototype.undo = function()
{
	var action = this.actions.pop();

	return action.undo();
};

//Redo last reverted action (returns type of action applied)
History.prototype.redo = function()
{
	//TODO <ADD CODE HERE>
	return null;
};