"use strict";

function AnimationClip(name, duration, tracks)
{
	THREE._AnimationClip.call(this, name, duration, tracks);

	this.enabled = true;
	this.loop = THREE.LoopRepeat; //LoopOnce || LoopRepeat || LoopPingPong
}

THREE._AnimationClip = THREE.AnimationClip;
THREE.AnimationClip = AnimationClip;

AnimationClip.prototype = Object.create(THREE._AnimationClip.prototype);

AnimationClip.prototype.toJSON = function(clip)
{
	var data = THREE._AnimationClip.prototype.toJSON.call(this, clip);

	data.enabled = this.enabled;
	data.loop = this.loop;

	return data;
}; 