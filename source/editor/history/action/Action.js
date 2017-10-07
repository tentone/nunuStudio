"use strict";

function Action(type, target)
{
	this.timestamp = 0;
	this.type = -1;
	this.target = null;
}

Action.prototype.apply = function(){};
Action.prototype.redo = function(){};
Action.prototype.undo = function(){};