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
