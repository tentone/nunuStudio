"use strict";

//Swap a object for another one
function ObjectSwapAction(originalObject, newObject, moveChildren)
{
	Action.call(this);
	
	this.originalObject = originalObject;
	this.newObject = newObject;
	this.moveChildren = moveChildren !== undefined ? moveChildren : true;

	this.parent = this.originalObject.parent;
	this.index = this.parent.children.indexOf(this.originalObject);
}

ObjectSwapAction.prototype.apply = function()
{
	this.parent.remove(this.originalObject);

	this.parent.children.splice(this.index, 0, this.newObject);
	this.newObject.parent = this.parent;

	if(this.moveChildren)
	{
		while(this.originalObject.children.length > 0)
		{
			var children = this.originalObject.children[0];
			this.originalObject.remove(children);
			this.newObject.add(children);
		}
	}

	this.updateGUI();
};

ObjectSwapAction.prototype.revert = function()
{
	this.parent.remove(this.newObject);

	this.parent.children.splice(this.index, 0, this.originalObject);
	this.originalObject.parent = this.parent;

	if(this.moveChildren)
	{
		while(this.newObject.children.length > 0)
		{
			var children = this.newObject.children[0];
			this.newObject.remove(children);
			this.originalObject.add(children);
		}
	}

	this.updateGUI();
};

ObjectSwapAction.prototype.updateGUI = function()
{
	Editor.updateObjectsViewsGUI();
};
