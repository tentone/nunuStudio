"use strict";

function AnimationClip()
{
	THREE.AnimationClip.call(this, root);
}

AnimationClip.prototype = Object.create(THREE.AnimationClip.prototype);

AnimationClip.prototype.toJSON = function(clip)
{
	var data = THREE.AnimationClip.prototype.toJSON.call(this, clip);

	return data;
}; 