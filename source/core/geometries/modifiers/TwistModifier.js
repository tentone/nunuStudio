
import {Vector3, Geometry, BufferGeometry, Quaternion} from "three";

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
	 * Indicates if the output should be a buffer geometry or a regular geometry.
	 *
	 * @attribute bufferGeometry
	 * @type {boolean}
	 */
	this.bufferGeometry = false;

	/**
	 * Twist direction vector, the twist is performed around this vector in its direction.
	 *
	 * @attribute direction
	 * @type {Vector3}
	 */
	this.direction = new Vector3(0, 1, 0);

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
 * @param {Geometry | BufferGeometry} geometry Geometry to be transformed.
 * @return {Geometry | BufferGeometry} Result geometry after applying the modifier.
 */
TwistModifier.prototype.modify = function(geometry)
{
	// Convert the geometry from buffer geometry to regular geometry
	if(geometry instanceof BufferGeometry)
	{
		geometry = new Geometry();
		geometry.fromBufferGeometry(Editor.selection[0].geometry);
		geometry.mergeVertices();
	}
	else
	{
		geometry = geometry.clone();
	}

	// Apply transformation to all vertices in the geometry.
	var quaternion = new Quaternion();

	for(var i = 0; i < geometry.vertices.length; i++)
	{
		var y = geometry.vertices[i].y;

		if(y >= this.start && y <= this.end)
		{
			// Calculate angle to apply interpolated from start to end
			var interpolate = (y - this.start) / (this.end - this.start);

			quaternion.setFromAxisAngle(this.direction, this.angle * interpolate);
			geometry.vertices[i].applyQuaternion(quaternion);
		}
		else if(y > this.end)
		{
			quaternion.setFromAxisAngle(this.direction, this.angle);
			geometry.vertices[i].applyQuaternion(quaternion);
		}
	}

	geometry.computeVertexNormals();
	geometry.verticesNeedUpdate = true;

	// Convert to buffer geometry if necessary
	if(this.bufferGeometry)
	{
		var bufferGeometry = new BufferGeometry();
		bufferGeometry.fromGeometry(geometry);
		return bufferGeometry;
	}

	return geometry;	 
};
export {TwistModifier};