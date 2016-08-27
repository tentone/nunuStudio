"use strict";

function TextureLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
}

TextureLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var texture = new Texture();

	var loader = new ImageLoader(this.manager);
	loader.setCrossOrigin(this.crossOrigin);
	loader.setWithCredentials(this.withCredentials);
	loader.setPath(this.path);
	
	loader.load(url, function(image)
	{
		//Check if image is a JPEG if so there is no need to store alpha
		var isJPEG = url.search(/\.(jpg|jpeg)$/) > 0 || url.search(/^data\:image\/jpeg/) === 0;

		texture.format = isJPEG ? RGBFormat : RGBAFormat;
		texture.image = image;
		texture.needsUpdate = true;

		if(onLoad !== undefined)
		{
			onLoad(texture);
		}
	}, onProgress, onError);

	return texture;
}

TextureLoader.prototype.setCrossOrigin = function(value)
{
	this.crossOrigin = value;
	return this;
}

TextureLoader.prototype.setWithCredentials = function(value)
{
	this.withCredentials = value;
	return this;
}

TextureLoader.prototype.setPath = function(value)
{
	this.path = value;
	return this;
}