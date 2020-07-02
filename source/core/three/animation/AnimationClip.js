
THREE.AnimationClip.prototype.enabled = true;
THREE.AnimationClip.prototype.loop = LoopRepeat;
THREE.AnimationClip.prototype.timeScale = 1;
THREE.AnimationClip.prototype.weight = 1;

THREE.AnimationClip._toJSON = AnimationClip.toJSON;
THREE.AnimationClip.toJSON = function(clip)
{
	var data = AnimationClip._toJSON.call(this, clip);

	data.enabled = clip.enabled;
	data.loop = clip.loop;
	data.timeScale = clip.timeScale;
	data.weight = clip.weight;

	return data;
};

THREE.AnimationClip._parse = AnimationClip.parse;
THREE.AnimationClip.parse = function(json)
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