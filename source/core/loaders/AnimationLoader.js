"use strict";

/**
 * @author bhouston / http://clara.io/
 */
function AnimationLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

AnimationLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var self = this;

	var loader = new THREE.FileLoader(self.manager);
	loader.load(url, function (text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

AnimationLoader.prototype.parse = function(json, onLoad)
{
	var animations = [];

	for(var i = 0; i < json.length; i++)
	{
		var clip = THREE.AnimationClip.parse(json[i]);
		animations.push(clip);
	}

	onLoad(animations);
};
