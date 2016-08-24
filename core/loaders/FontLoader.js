"use strict";

//Font loader
function FontLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

//Parse font data
FontLoader.prototype.parse = function(data)
{
	return new THREE.Font(JSON.parse(data));
}

//Load font file
FontLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var loader = new THREE.XHRLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(new THREE.Font(JSON.parse(text)));
	}, onProgress, onError);
}