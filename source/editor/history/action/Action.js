"use strict";

function Action(type, target)
{
	this.timestamp = 0;
	this.type = -1;
	this.target = null;
}

Action.prototype.apply = function()
{
	//TODO <ADD CODE HERE>
};

Action.prototype.redo = function()
{
	//TODO <ADD CODE HERE>
};

Action.prototype.undo = function()
{
	//TODO <ADD CODE HERE>
};