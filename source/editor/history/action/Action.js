"use strict";

function Action(type, target)
{
	this.id = 0;
}

Action.prototype.apply = function(){};
Action.prototype.revert = function(){};
