"use strict";

//Constructor from object before changes parent and change type
function Action(object, type, target, parent, state)
{
	if(type === Action.CHANGED)
	{
		this.object = new ObjectLoader().parse(object.toJSON(undefined, undefined, false));
	}
	else
	{
		this.object = object;
	}

	this.type = type;
	this.target = target;
	this.state = state;

	this.parent = (parent !== undefined) ? parent : object.parent;
	this.order = -1;

	//Try to get object order
	var children = this.parent.children;
	for(var i = 0; i < children.length; i++)
	{
		if(object.uuid === children[i].uuid)
		{
			this.order = i;
			break;
		}
	}
}

//Actions type
Action.ADDED = 10;
Action.REMOVED = 11;
Action.CHANGED = 12;

//Action target
Action.TARGET_OBJECT = 20;
Action.TARGET_RESOURCE = 21;
