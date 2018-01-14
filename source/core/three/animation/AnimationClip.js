"use strict";

THREE.AnimationClip.prototype.enabled = true;
THREE.AnimationClip.prototype.loop = THREE.LoopRepeat;
THREE.AnimationClip.prototype.timeScale = 1;
THREE.AnimationClip.prototype.weight = 1;

THREE.AnimationClip._toJSON = THREE.AnimationClip.toJSON;
THREE.AnimationClip._parse = THREE.AnimationClip.parse;

THREE.AnimationClip.toJSON = function(clip)
{
	var data = THREE.AnimationClip._toJSON.call(this, clip);

	data.enabled = this.enabled;
	data.loop = this.loop;
	data.timeScale = this.timeScale;
	data.weight = this.weight;

	return data;
};

THREE.AnimationClip.parse = function(json)
{
	var clip = THREE.AnimationClip._parse.call(this, json);

	clip.enabled = json.enabled;
	clip.loop = json.loop;
	clip.timeScale = json.timeScale;
	clip.weight = json.weight;

	return clip;
};