"use strict";

THREE.AnimationClip.prototype.enabled = true;
THREE.AnimationClip.prototype.loop = THREE.LoopRepeat;
THREE.AnimationClip.prototype.timeScale = 1;
THREE.AnimationClip.prototype.weight = 1;

THREE.AnimationClip._toJSON = THREE.AnimationClip.toJSON;
THREE.AnimationClip.toJSON = function(clip)
{
	var data = THREE.AnimationClip._toJSON.call(this, clip);

	data.enabled = clip.enabled;
	data.loop = clip.loop;
	data.timeScale = clip.timeScale;
	data.weight = clip.weight;

	return data;
};

THREE.AnimationClip._parse = THREE.AnimationClip.parse;
THREE.AnimationClip.parse = function(json)
{
	var clip = THREE.AnimationClip._parse.call(this, json);

	if(json.enabled !== undefined)
	{
		clip.enabled = json.enabled;
		clip.loop = json.loop;
		clip.timeScale = json.timeScale;
		clip.weight = json.weight;
	}

	return clip;
};