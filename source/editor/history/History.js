"use strict";

//Stores changes to an object
function History(limit)
{
	this.actions = [];
	this.counter = 0;

	this.position = -1;
	this.limit = limit !== undefined ? limit : 10;
}

//Add change to program history
History.prototype.add = function(action)
{	
	//If there are more recent changes remove them
	while(this.actions.length > this.position + 1)
	{
		this.actions.pop();
	}

	//Add action to list
	this.actions.push(action);
	this.position++;
			
	//Apply action
	action.apply();
	action.id = this.counter;
	this.counter++;

	//Limit actions size
	while(this.actions.length > this.limit)
	{
		this.actions.splice(0, 1)
		this.position = this.actions.length - 1;
	}
};

//Revert last action
History.prototype.undo = function()
{
	if(this.actions.length > 0 && this.position >= 0)
	{
		this.actions[this.position].revert();
		this.position--;
		return true;
	}

	return false;
};

//Redo last reverted action
History.prototype.redo = function()
{
	if(this.position < this.actions.length - 1)
	{
		this.position++;
		this.actions[this.position].apply();
		return true;
	}

	return false;
};