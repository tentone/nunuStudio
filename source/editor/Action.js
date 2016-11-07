"use strict";

//Constructor from object before changes parent and change type
function Action(object, parent, type)
{
	this.object = object.toJSON();
	this.object.children = [];
	
	this.parent = parent;
	this.type = type;
}

//Types
Action.ADDED = 0;
Action.REMOVED = 1;
Action.CHANGED = 2;
