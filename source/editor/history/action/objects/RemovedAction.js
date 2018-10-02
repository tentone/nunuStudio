"use strict";

//Object removed.
function RemovedAction(object, parent)
{
	Action.call(this);
	
	this.object = object;

	this.parent = (parent !== undefined) ? parent : object.parent;
	this.index = -1;
}

RemovedAction.prototype.apply = function()
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

	RemovedAction.updateGUI(this.object, this.parent);
};

RemovedAction.prototype.revert = function()
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

	AddedAction.updateGUI(this.object, this.parent, this.index);
};

RemovedAction.updateGUI = function(object, parent)
{
	if(Editor.isSelected(object))
	{
		Editor.removeFromSelection(object);
	}

	Editor.gui.treeView.removeObject(object, parent);
};
