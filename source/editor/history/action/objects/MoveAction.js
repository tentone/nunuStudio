"use strict";

/**
 * Action to represent a object move in the children tree.
 *
 * Objects can be moved between parents, and to specific positions (index).
 *
 * If necessary the action can also calculate the inverse tranform to estimate new pose values to keep the global pose of the moved object the same.
 *
 * @class MoveAction
 * @extends {Action}
 * @param {THREE.Object3D} object Object to be moved.
 * @param {THREE.Object3D} newParent New parent of the object.
 * @param {number} newIndex Index to insert the object.
 */
function MoveAction(object, newParent, newIndex)
{
	Action.call(this);
	
	this.object = object;

	this.oldParent = object.parent;
	this.oldIndex = this.oldParent.children.indexOf(this.object);

	this.newParent = newParent;
	this.newIndex = newIndex;

	this.keepGlobalPose = Editor.settings.editor.keepTransformMove;
}

MoveAction.prototype.apply = function()
{
	this.oldParent.remove(this.object);
	
	if(this.keepGlobalPose)
	{
		this.inverseTransform(this.oldParent, this.newParent);
	}

	if(this.newIndex === undefined)
	{
		this.newParent.add(this.object);
		this.newIndex = this.newParent.children.indexOf(this.object);
	}
	else
	{
		var children = this.newParent.children;
		children.splice(this.newIndex, 0, this.object);
		this.object.parent = this.newParent;
	}

	MoveAction.updateGUI(this.object, this.oldParent, this.newParent, this.newIndex);
};

MoveAction.prototype.revert = function()
{
	this.newParent.remove(this.object);

	if(this.keepGlobalPose)
	{
		this.inverseTransform(this.newParent, this.oldParent);
	}

	var children = this.oldParent.children;
	children.splice(this.oldIndex, 0, this.object);
	this.object.parent = this.oldParent;

	MoveAction.updateGUI(this.object, this.newParent, this.oldParent, this.oldIndex);
};

MoveAction.prototype.inverseTransform = function(oldParent, newParent)
{
	var matrix = this.object.matrix;

	//Apply world matrix to object (calculate transform as if it was on the root)
	matrix.multiplyMatrices(oldParent.matrixWorld, matrix);

	//Get inverse of the world matrix of the new parent
	var inverse = new THREE.Matrix4();
	inverse.getInverse(newParent.matrixWorld);

	//Apply inverse transform to the object matrix
	matrix.multiplyMatrices(inverse, matrix);

	//Decompose matrix into components
	matrix.decompose(this.object.position, this.object.quaternion, this.object.scale);
};

MoveAction.updateGUI = function(object, oldParent, newParent, newIndex)
{
	if(this.keepGlobalPose)
	{
		Editor.gui.inspector.updateValues();
	}
	
	Editor.gui.tree.moveObject(object, oldParent, newParent, newIndex);
};


