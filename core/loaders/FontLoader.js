"use strict";

//Font loader
function FontLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

//Load font from url
FontLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var loader = new THREE.XHRLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(new Font(JSON.parse(text)));
	}, onProgress, onError);
}

//Parse JSON font data
FontLoader.prototype.parse = function(text)
{
	return new Font(JSON.parse(text));
}
