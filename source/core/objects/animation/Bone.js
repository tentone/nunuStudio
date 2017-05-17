"use strict";

/**
 * Bone represents a bone joint for skeletal animation.
 *
 * More information about Bone can be found here https://threejs.org/docs/index.html?q=bon#Reference/Objects/Bone.
 *
 * @class Bone
 * @module Animation
 * @constructor
 */
function Bone()
{
	THREE.Bone.call(this);

	this.name = "bone";
}

Bone.prototype = Object.create(THREE.Bone.prototype);
