"use strict";

/**
 * Object utils is a collection of methods to apply operations to Object3D instances.
 *
 * @static
 * @class ObjectUtils
 * @module Utils
 */
function ObjectUtils(){}

/**
 * Get object tree root by traversing the tree upwards.
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
 * Scale and center object into a unitary box.
 *
 * Useful to scale objects to fit into a known size box.
 * 
 * @method centerUnitary
 * @param {Object3D} object Object to be positioned and scaled.
 */
ObjectUtils.centerUnitary = function(object)
{
	var box = ObjectUtils.calculateBoundingBox(object);
	
	if(box !== null)
	{
		var size = new THREE.Vector3();
		box.getSize(size);

		var scale = 1 / (size.x > size.y ? size.x > size.z ? size.x : size.z : size.y > size.z ? size.y : size.z);
		
		var center = new THREE.Vector3();
		box.getCenter(center);
		center.multiplyScalar(scale);

		object.scale.set(scale, scale, scale);
		object.position.set(-center.x, -scale * box.min.y, -center.z);
	}
};

/**
 * Calculates a bouding box for an object considering all its children.
 *
 * Includes booth the object and all of its children, the box is ajusted to world space coordinates.
 *
 * @method calculateBoudingBox
 * @param {THREE.Object3D} object Root object to be traversed.
 * @return {THREE.Box3} Bouding box of the object considering all of its children.
 */
ObjectUtils.calculateBoundingBox = function(object)
{
	var box = null;

	object.traverse(function(children)
	{
		var boundingBox = null;

		// Sprites
		if(children.isSprite === true)
		{
			var position = new THREE.Vector3();
			children.getWorldPosition(position);
			boundingBox = new THREE.Box3(position.clone().subScalar(0.5), position.clone().addScalar(0.5));
		}
		// Mesh, Points, Lines
		else if(children.geometry !== undefined)
		{
			children.geometry.computeBoundingBox();
			boundingBox = children.geometry.boundingBox.clone();
			boundingBox.applyMatrix4(children.matrixWorld);

			children.geometry.computeBoundingBox();
			var boundingBox = children.geometry.boundingBox;
		}

		// Update bouding box size
		if(boundingBox !== null)
		{
			// First box
			if(box === null)
			{
				box = boundingBox;
			}
			// Ajust box size to contain new box
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
 * @method centerGeometryOrigin
 * @param {Object3D} object Object to recalculate origin of.
 */
ObjectUtils.centerGeometryOrigin = function(object)
{
	object.traverse(function(children)
	{
		if(children.geometry !== undefined)
		{
			children.geometry.computeBoundingBox();

			var box = children.geometry.boundingBox.clone();

			var center = box.getCenter(new THREE.Vector3());
			children.position.add(center);

			// Recenter geometry
			var matrix = new THREE.Matrix4();
			matrix.makeTranslation(-center.x, -center.y, -center.z);
			children.geometry.applyMatrix4(matrix);
		}
	});
};

/**
 * Covert all the geometries found in the object to BufferGeometry format.
 *
 * @method convertToBufferGeometry
 * @param {Object3D} object Object to search for geometries
 */
ObjectUtils.convertToBufferGeometry = function(object)
{
	object.traverse(function(children)
	{
		if(children.geometry !== undefined && children.geometry.isGeometry === true)
		{
			children.geometry = new THREE.BufferGeometry().fromGeometry(children.geometry);
		}
	});
};
