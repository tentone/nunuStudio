"use strict";

/**
 * The twist modifier applies a tornado twist like deformation to the geometry.
 *
 * It follows a vector from a start to and end point in the vector and rotates all vertex for each point up to a defined final angle.
 *
 * @class TwistModifier
 */
function TwistModifier(angle, start, end)
{
	/**
	 * Twist direction vector, the twist is performed around this vector in its direction.
	 *
	 * @attribute direction
	 * @type {THREE.Vector3}
	 */
	this.direction = new THREE.Vector3(0, 1, 0);

	/**
	 * Twist angle of rotation, applied from the start to the end of rotation.
	 *
	 * @attribute angle
	 * @type {number}
	 */
	this.angle = angle !== undefined ? angle : Math.PI;

	/**
	 * Start height of the twist rotation.
	 *
	 * This values is in geometry coordinate space.
	 *
	 * @attribute start
	 * @type {number}
	 */
	this.start = start !== undefined ? start : 0;

	/*
	 * End height of the twist rotation.
	 *
	 * This values is in geometry coordinate space.
	 *
	 * @attribute end
	 * @type {number}
	 */
	this.end = end !== undefined ? end : 1;
}

/**
 * Apply the modifier to a geometry object, creates a new geometry with the result.
 *
 * @method modify
 * @param {THREE.Geometry | THREE.BufferGeometry} geometry Geometry to be transformed.
 * @return {THREE.Geometry | THREE.BufferGeometry} Result geometry after applying the modifier.
 */
TwistModifier.prototype.modify = function(geometry)
{
	// Convert the geometry from buffer geometry to regular geometry
	if(geometry instanceof THREE.BufferGeometry)
	{
		geometry = new THREE.Geometry();
		geometry.fromBufferGeometry(Editor.selection[0].geometry);
		geometry.mergeVertices();
	}
	else
	{
		geometry = geometry.clone();
	}

	// Apply transformation to all vertices in the geometry.
	var quaternion = new THREE.Quaternion();

	for(var i = 0; i < geometry.vertices.length; i++)
	{
		var y = geometry.vertices[i].y;
		if(y >= this.start && y <= this.end)
		{
			quaternion.setFromAxisAngle(this.direction, this.angle * y);
			geometry.vertices[i].applyQuaternion(quaternion);
		}
	}

	geometry.verticesNeedUpdate = true;
	
	return geometry;	 
};