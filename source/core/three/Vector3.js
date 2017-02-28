"use strict";

/**
 * Class representing a 3D vector. A 3D vector is an ordered triplet of numbers (labeled x, y, and z), which can be used to represent a number of things, such as:
 *
 *  - A point in 3D space.
 *  - A direction and length in 3D space. In three.js the length will always be the Euclidean distance (straight-line distance) from (0, 0, 0) to (x, y, z) and the direction is also measured from (0, 0, 0) towards (x, y, z).
 *  - Any arbitrary ordered triplet of numbers.
 * 
 * There are other things a 3D vector can be used to represent, such as momentum vectors and so on, however these are the most common uses in three.js.
 *
 * Original documentation for Vector3 can be found here https://threejs.org/docs/index.html#Reference/Math/Vector3
 * 
 * @class Vector3
 * @constructor
 * @module Math
 */

/**
 * @property x
 * @type {Number}
 * @default 0
 */

/**
 * @property y
 * @type {Number}
 * @default 0
 */

/**
 * @property z
 * @type {Number}
 * @default 0
 */

/**
 * Create Vector3 from JSON data
 *
 * @method fromJSON
 * @param {Object} data
 * @return {Vector3} vector3
 */
THREE.Vector3.fromJSON = function(data)
{
	return new THREE.Vector3(data.x, data.y, data.z);
};

/**
 * Serialize Vector3 data to JSON
 *
 * @method toJSON
 * @return {Object} json
 */
THREE.Vector3.prototype.toJSON = function()
{
	return {x: this.x, y: this.y, z: this.z};
};

/**
 * Add v to this vector.
 *
 * @method add
 * @param {Vector3} v
 */

/**
 * Add the scalar value s to this vector's x, y and z values.
 *
 * @method addScalar
 * @param {Number} scalar
 */

