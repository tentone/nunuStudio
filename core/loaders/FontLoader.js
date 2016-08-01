"use strict";

//Font loader
function FontLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

//Functions prototype
FontLoader.prototype.load = load;
FontLoader.prototype.parse = parse;

//Parse font data
function parse(data)
{
	return new THREE.Font(JSON.parse(data));
}

//Load font file
function load(url, onLoad, onProgress, onError)
{
	var loader = new THREE.XHRLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(new THREE.Font(JSON.parse(text)));
	}, onProgress, onError);
}