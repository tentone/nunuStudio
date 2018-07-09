"use strict";

//Object removed.
function ObjectRemovedAction(object, parent)
{
	Action.call(this);
	
	this.object = object;

	this.parent = (parent !== undefined) ? parent : object.parent;
	this.index = -1;
}

ObjectRemovedAction.prototype.apply = function()
{
	if(this.object instanceof THREE.Camera)
	{
		var scene = this.object.getScene();
		if(scene !== null)
		{
			scene.removeCamera(this.object);
		}
	}
	
	this.index = this.parent.children.indexOf(this.object);
	this.parent.remove(this.object);

	this.updateGUI();
};

ObjectRemovedAction.prototype.revert = function()
{
	if(this.index === -1)
	{
		this.parent.add(this.object);
	}
	else
	{
		this.parent.children.splice(this.index, 0, this.object);
		this.object.parent = this.parent;
	}

	this.updateGUI();
};

ObjectRemovedAction.prototype.updateGUI = function()
{
	if(Editor.isObjectSelected(this.object))
	{
		Editor.removeFromSelection(this.object);
	}

	Editor.gui.treeView.removeObject(this.object, this.parent);
};
