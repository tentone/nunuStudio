"use strict";

function ObjectRemovedAction(object, parent)
{
	this.object = object;
	this.parent = (parent !== undefined) ? parent : object.parent;
}

ObjectRemovedAction.prototype.apply = function()
{
	if(this.object instanceof THREE.Camera)
	{
		var scene = ObjectUtils.getScene(this.object);
		if(scene !== null)
		{
			scene.removeCamera(this.object);
		}
	}
	
	this.parent.remove(this.object);
};

ObjectRemovedAction.prototype.revert = function()
{
	this.parent.add(this.object);
};
