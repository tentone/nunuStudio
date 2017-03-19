"use strict";

/**
 * Animation object is an object that can be keyframe animated.
 *
 * Animation objects work the same way a container does, the only diference its the fact that they have attached an animation.
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
	this.type = "Animation";

	//TODO <ADD CODE HERE>
}

Animation.prototype = Object.create(THREE.Object3D.prototype);
