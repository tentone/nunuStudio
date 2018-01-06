"use strict";

function AnimationClip(name, duration, tracks)
{
	THREE.AnimationClip.call(this, name, duration, tracks);

	this.loop = THREE.LoopRepeat; //LoopOnce || LoopRepeat || LoopPingPong
}

AnimationClip.prototype = Object.create(THREE.AnimationClip.prototype);

AnimationClip.prototype.toJSON = function(clip)
{
	var data = THREE.AnimationClip.prototype.toJSON.call(this, clip);

	data.loop = this.loop;

	return data;
}; 