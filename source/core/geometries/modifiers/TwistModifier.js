import {Vector3, BufferGeometry, Quaternion} from "three";

/**
 * The twist modifier applies a tornado twist like deformation to the geometry.
 *
 * It follows a vector from a start to and end point in the vector and rotates all vertex for each point up to a defined final angle.
 *
 * @class TwistModifier
 */
class TwistModifier
{
constructor(angle, start, end)
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
 * Apply the modifier to a BufferGeometry, returns a new BufferGeometry with the twist applied.
 *
 * @method modify
 * @param {BufferGeometry} geometry Geometry to be transformed.
 * @return {BufferGeometry} Result geometry after applying the modifier.
 */
modify(geometry)
{
var result = geometry.clone();

var position = result.attributes.position;
if (!position)
{
console.warn("nunuStudio: TwistModifier - geometry has no position attribute.");
return result;
}

var quaternion = new Quaternion();
var vertex = new Vector3();

for (var i = 0; i < position.count; i++)
{
vertex.fromBufferAttribute(position, i);
var y = vertex.y;

if (y >= this.start && y <= this.end)
{
// Calculate angle to apply interpolated from start to end
var interpolate = (y - this.start) / (this.end - this.start);
quaternion.setFromAxisAngle(this.direction, this.angle * interpolate);
vertex.applyQuaternion(quaternion);
}
else if (y > this.end)
{
quaternion.setFromAxisAngle(this.direction, this.angle);
vertex.applyQuaternion(quaternion);
}

position.setXYZ(i, vertex.x, vertex.y, vertex.z);
}

position.needsUpdate = true;
result.computeVertexNormals();

return result;
}
}

export {TwistModifier};
