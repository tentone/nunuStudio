"use strict";

//Stores program changes history
function History(program)
{
	//Program
	this.program = program;

	//Actions list and history size limit
	this.actions = [];
	this.size = 50;

	//Actual state
	this.state = 0;
}

//Add change to program history
History.prototype.push = function(object, type, parent)
{
	this.actions.push(new Action(object, type, Action.TARGET_OBJECT, parent, this.state));
	this.state++;

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

	if(action !== undefined)
	{
		if(action.target === Action.TARGET_OBJECT)
		{
			if(action.type === Action.CHANGED)
			{
				var children = action.parent.children;
				for(var i = 0; i < children.length; i++)
				{
					if(children[i].uuid === action.object.uuid)
					{
						action.object.parent = children[i].parent;
						action.object.children = children[i].children;
						children[i] = action.object;
					}
				}
			}
			else if(action.type === Action.REMOVED)
			{
				action.parent.add(action.object);
			}
			else if(action.type === Action.ADDED)
			{
				action.object.destroy();
			}
		}
		else if(action.target === Action.TARGET_TEXTURE)
		{
			//TODO <ADD CODE HERE>
		}
		return action;
	}

	return null;
};

//Redo last reverted action (returns type of action applied)
History.prototype.redo = function()
{
	//TODO <ADD CODE HERE>
	return null;
};