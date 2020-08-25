import {Object3D, Camera} from "three";
import {Action} from "../Action.js";
import {Editor} from "../../../Editor.js";
import {AddAction} from "./AddAction.js";

/**
 * Remove object from the scene.
 *
 * @class RemoveAction
 * @extends {Action}
 * @param {Object3D} object
 * @param {Object3D} parent Optional.
 */
function RemoveAction(object, parent)
{
	Action.call(this);
	
	this.object = object;

	this.parent = parent !== undefined ? parent : object.parent;
	this.index = -1;
}

RemoveAction.prototype.apply = function()
{
	if (this.object instanceof Camera)
	{
		var scene = this.object.getScene();
		if (scene !== null)
		{
			scene.removeCamera(this.object);
		}
	}
	
	this.index = this.parent.children.indexOf(this.object);
	this.parent.remove(this.object);

	RemoveAction.updateGUI(this.object, this.parent);
};

RemoveAction.prototype.revert = function()
{
	if (this.index === -1)
	{
		this.parent.add(this.object);
	}
	else
	{
		this.parent.children.splice(this.index, 0, this.object);
		this.object.parent = this.parent;
	}

	AddAction.updateGUI(this.object, this.parent, this.index);
};

RemoveAction.updateGUI = function(object, parent)
{
	if (Editor.isSelected(object))
	{
		Editor.unselectObject(object);
	}

	Editor.gui.tree.removeObject(object, parent);
};

export {RemoveAction};
