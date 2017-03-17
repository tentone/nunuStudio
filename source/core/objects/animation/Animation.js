"use strict";

/**
 * Animation object is an object that can be keyframe animated.
 *
 * @class Animation
 * @module Animation
 * @constructor
 * @extends {Object3D}
 */
function Animation()
{
	THREE.Object3D.call(this);

	this.name = "animation";

	//TODO <ADD CODE HERE>
}

Animation.prototype = Object.create(THREE.Object3D.prototype);
