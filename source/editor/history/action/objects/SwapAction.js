import {Object3D} from "three";
import {Action} from "../Action.js";
import {RemoveAction} from "./RemoveAction.js";
import {AddAction} from "./AddAction.js";

/**
 * Swap an object for another one.
 *
 * The children of the original object can be moved to the new object.
 *
 * @class SwapAction
 * @extends {Action}
 * @param {Object3D} originalObject Object originally in place, to be replaced.
 * @param {Object3D} newObject Object to take place of the old one.
 * @param {boolean} moveChildren If true move the children from the original object to the new.
 */
function SwapAction(originalObject, newObject, moveChildren)
{
	Action.call(this);
	
	this.originalObject = originalObject;
	this.newObject = newObject;

	this.parent = this.originalObject.parent;
	this.index = -1;
	
	this.moveChildren = moveChildren !== undefined ? moveChildren : true;
}

SwapAction.prototype.apply = function()
{	
	// Check the index
	this.index = this.parent.children.indexOf(this.originalObject);

	// Remove object
	this.parent.remove(this.originalObject);

	// Add new object to parent
	this.newObject.parent = this.parent;
	this.parent.children.splice(this.index, 0, this.newObject);

	// Move children from original to new
	if (this.moveChildren)
	{
		while (this.originalObject.children.length > 0)
		{
			var children = this.originalObject.children[0];
			this.originalObject.remove(children);
			this.newObject.add(children);
		}
	}

	RemoveAction.updateGUI(this.originalObject, this.parent);
	AddAction.updateGUI(this.newObject, this.parent, this.index);
};

SwapAction.prototype.revert = function()
{
	this.parent.remove(this.newObject);

	// Add original object to parent
	this.originalObject.parent = this.parent;
	this.parent.children.splice(this.index, 0, this.originalObject);

	// Move children from new back to original
	if (this.moveChildren)
	{
		while (this.newObject.children.length > 0)
		{
			var children = this.newObject.children[0];
			this.newObject.remove(children);
			this.originalObject.add(children);
		}
	}

	RemoveAction.updateGUI(this.newObject, this.parent);
	AddAction.updateGUI(this.originalObject, this.parent, this.index);
};
export {SwapAction};
