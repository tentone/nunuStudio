"use strict";

/**
 * Add an object to the scene.
 *
 * The object can be inserted at a specific index inside the children list.
 *
 * @class AddAction
 * @extends {Action}
 * @param {THREE.Object3D} object Object to be added.
 * @param {THREE.Object3D} parent Parent to add the object.
 * @param {number} index Index to add the object to.
 */
function AddAction(object, parent, index)
{
	Action.call(this);
	
	this.object = object;
	this.index = (index !== undefined) ? index : -1;

	this.parent = parent;
}

AddAction.prototype.apply = function()
{
	if(this.index !== -1)
	{
		this.parent.children.splice(this.index, 0, this.object);
		this.object.parent = this.parent;
	}
	else
	{
		this.parent.add(this.object);
		this.index = this.parent.children.indexOf(this.object);
	}

	AddAction.updateGUI(this.object, this.parent, this.index);
};

AddAction.prototype.revert = function()
{
	this.parent.remove(this.object);

	RemoveAction.updateGUI(this.object, this.parent);
};

AddAction.updateGUI = function(object, parent, index)
{
	Editor.gui.tree.addObject(object, parent, index);
};
