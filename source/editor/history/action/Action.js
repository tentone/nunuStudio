"use strict";

function Action(type, target)
{
	this.id = Action.ID++;
}

Action.ID = 0;

Action.prototype.apply = function(){};
Action.prototype.revert = function(){};
