"use strict";

/**
 * ObjectUtils is a collection of methods to apply operations to Object3D objects
 *
 * @class ObjectUtils
 * @module Utils
 * @static
 */
function ObjectUtils(){}

/**
 * Get scene that contains this object.
 *
 * @method getScene
 * @param {Object3D} obj
 * @return {Object3D} scene
 */
ObjectUtils.getScene = function(obj)
{
	var node = obj;

	while(node.parent !== null)
	{
		node = node.parent;

		if(node instanceof Scene)
		{
			return node;
		}
	}

	return null;
};

/**
 * Get object tree root.
 *
 * For a object placed inside a running scene the root is always the program.
 *
 * @method getRoot
 * @param {Object3D} obj
 * @return {Object3D} root
 */
ObjectUtils.getRoot = function(obj)
{
	var node = obj;
	
	while(node.parent !== null)
	{
		node = node.parent;
	}

	return node;
};

/**
 * Set object and all its children matrixAutoUpdate value
 *
 * @method setMatrixAutoUpdate
 * @param {Object3D} obj
 * @param {boolean} value
 */
ObjectUtils.setMatrixAutoUpdate = function(obj, value)
{
	obj.matrixAutoUpdate = value;

	obj.traverse(function(child)
	{
		child.matrixAutoUpdate = value;
	});
};

/**
 * Set object and all children to receive shadows
 *
 * @method setShadowReceiving
 * @param {Object3D} obj
 * @param {boolean} value
 */
ObjectUtils.setShadowReceiving = function(obj, value)
{
	obj.receiveShadow = value;

	obj.traverse(function(child)
	{
		child.receiveShadow = value;
	});
};

/**
 * Set object and all children to cast shadows
 *
 * @method setShadowCasting
 * @param {Object3D} obj
 * @param {boolean} value
 */
ObjectUtils.setShadowCasting = function(obj, value)
{
	obj.castShadow = value;
	
	obj.traverse(function(child)
	{
		child.castShadow = value;
	});
};

/**
 * Check if object is child of another object
 *
 * @method isChildOf
 * @param {Object3D} parent
 * @param {Object3D} child
 * @return {boolean} True if parent is parent of child
 */
ObjectUtils.isChildOf = function(parent, child)
{
	for(var i = 0; i < parent.children.length; i++)
	{
		if(parent.children[i] === child || ObjectUtils.isChildOf(parent.children[i], child))
		{
			return true;
		}
	}
	
	return false;
};

/**
 * Calculates a bouding box for an object considering all its children.
 *
 * @method calculateBoudingBox
 * @param {Object3D} object
 * @return {Box3} Bouding box calculated.
 */
ObjectUtils.calculateBoundingBox = function(object)
{
	var box = null;

	object.traverse(function(children)
	{
		if(children.geometry !== undefined)
		{
			children.geometry.computeBoundingBox();
			var boundingBox = children.geometry.boundingBox;

			if(box === null)
			{
				box = boundingBox.clone();
			}
			//Ajust box size
			else
			{
				if(boundingBox.min.x < box.min.x) {box.min.x = boundingBox.min.x;}
				if(boundingBox.max.x > box.max.x) {box.max.x = boundingBox.max.x;}
				if(boundingBox.min.y < box.min.y) {box.min.y = boundingBox.min.y;}
				if(boundingBox.max.y > box.max.y) {box.max.y = boundingBox.max.y;}
				if(boundingBox.min.z < box.min.z) {box.min.z = boundingBox.min.z;}
				if(boundingBox.max.z > box.max.z) {box.max.z = boundingBox.max.z;}
			}
		}
	});

	return box;
};

/**
 * Recalculate all children origins, to be centered with their geometry.
 *
 * @method recalculateGeometryOrigin
 * @param {Object3D} object Object to recalculate origin of.
 */
ObjectUtils.recalculateGeometryOrigin = function(object)
{
	object.traverse(function(children)
	{
		if(children.geometry !== undefined)
		{
			children.geometry.computeBoundingBox();

			var box = children.geometry.boundingBox.clone();
			box.applyMatrix4(children.matrixWorld);

			var center = box.getCenter(new THREE.Vector3());

			children.position.copy(center);

			var matrix = new THREE.Matrix4();
			matrix.makeTranslation(-center.x, -center.y, -center.z);
			children.geometry.applyMatrix(matrix);
		}
	});
};
