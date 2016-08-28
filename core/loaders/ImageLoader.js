"use strict";

function ImageLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

ImageLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var self = this;
	var image = document.createElement("img");

	image.onload = function()
	{
		URL.revokeObjectURL(image.src);

		if(onLoad)
		{
			onLoad(image);
		}

		self.manager.itemEnd(url);
	};

	if(url.indexOf("data:") === 0)
	{
		image.src = url;
	}
	else
	{
		var loader = new XHRLoader();
		loader.setPath(this.path);
		loader.setResponseType("blob");
		loader.setWithCredentials(this.withCredentials);
		loader.load(url, function(blob)
		{
			image.src = URL.createObjectURL(blob);
		}, onProgress, onError);
	}

	this.manager.itemStart(url);

	return image;
}

ImageLoader.prototype.setWithCredentials = function(value)
{
	this.withCredentials = value;
	return this;
}

ImageLoader.prototype.setPath = function(value)
{
	this.path = value;
	return this;
}
