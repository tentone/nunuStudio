"use strict";

//Object moved in the object tree.
function MovedAction(object, newParent, newIndex, keepGlobalPose)
{
	Action.call(this);
	
	this.object = object;

	this.oldParent = object.parent;
	this.oldIndex = this.oldParent.children.indexOf(this.object);

	this.newParent = newParent;
	this.newIndex = newIndex;

	this.keepGlobalPose = keepGlobalPose !== undefined ? keepGlobalPose : true;
}

MovedAction.prototype.apply = function()
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


	MovedAction.updateGUI(this.object, this.oldParent, this.newParent, this.newIndex);
};

MovedAction.prototype.revert = function()
{
	this.newParent.remove(this.object);

	if(this.keepGlobalPose)
	{
		this.inverseTransform(this.newParent, this.oldParent);
	}

	var children = this.oldParent.children;
	children.splice(this.oldIndex, 0, this.object);
	this.object.parent = this.oldParent;

	MovedAction.updateGUI(this.object, this.newParent, this.oldParent, this.oldIndex);
};

MovedAction.prototype.inverseTransform = function(oldParent, newParent)
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

MovedAction.updateGUI = function(object, oldParent, newParent, newIndex)
{
	Editor.gui.treeView.moveObject(object, oldParent, newParent, newIndex);
};


