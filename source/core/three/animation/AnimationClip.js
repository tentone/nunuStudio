import {AnimationClip, LoopRepeat} from "three";

AnimationClip.prototype.enabled = true;
AnimationClip.prototype.loop = LoopRepeat;
AnimationClip.prototype.timeScale = 1;
AnimationClip.prototype.weight = 1;

AnimationClip._toJSON = AnimationClip.toJSON;
AnimationClip.toJSON = function(clip)
{
	var data = AnimationClip._toJSON.call(this, clip);

	data.enabled = clip.enabled;
	data.loop = clip.loop;
	data.timeScale = clip.timeScale;
	data.weight = clip.weight;

	return data;
};

AnimationClip._parse = AnimationClip.parse;
AnimationClip.parse = function(json)
{
	var clip = AnimationClip._parse.call(this, json);

	if(json.enabled !== undefined)
	{
		clip.enabled = json.enabled;
		clip.loop = json.loop;
		clip.timeScale = json.timeScale;
		clip.weight = json.weight;
	}

	return clip;
};