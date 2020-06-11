"use strict";

/**
 * The twist modifier applies a tornado twist like deformation to the geometry.
 *
 * It follows a vector from a start to and end point in the vector and rotates all vertex for each point up to a defined final angle.
 *
 * @class TwistModifier
 */
function TwistModifier()
{
	/**
	 * Twist direction vector.
	 *
	 * @attribute direction
	 * @type {THREE.Vector3}
	 */
	this.direction = new THREE.Vector3(0, 1, 0);

	/**
	 * Twist angle of rotation.
	 *
	 * @attribute angle
	 * @type {number}
	 */
	this.angle = Math.PI;
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
		var yPos = geometry.vertices[i].y;
		quaternion.setFromAxisAngle(this.direction, this.angle * yPos);
		geometry.vertices[i].applyQuaternion(quaternion);
	}

	geometry.verticesNeedUpdate = true;
	
	return geometry;	 
};