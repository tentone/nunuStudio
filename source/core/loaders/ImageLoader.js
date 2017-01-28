"use strict";

function ImageLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

ImageLoader.prototype.loadJSON = function(url, onLoad, onProgress, onError)
{
	var self = this;
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		self.parse(JSON.parse(text), onLoad);
	}, onProgress, onError);
}

ImageLoader.prototype.parse = function(json, onLoad)
{
	var image = new Image();
	
	image.name = json.name;
	image.uuid = json.uuid;
	image.format = json.format;
	image.encoding = json.encoding;
	image.data = json.data;
	
	return image;
}
