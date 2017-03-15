"use strict";

/**
 * ImageLoader can be used to load external image resources.
 *
 * @class ImageLoader
 * @constructor
 * @module Loaders
 * @param {Object} manager
 */
function ImageLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

/**
 * Load image resource from url.
 *
 * @method loadJSON
 * @param {String} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
ImageLoader.prototype.loadJSON = function(url, onLoad, onProgress, onError)
{
	var self = this;
	
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Parse image json and return resource.
 *
 * @method parse
 * @param {Object} json
 * @return {Image} Image resource
 */
ImageLoader.prototype.parse = function(json)
{
	var image = new Image();
	
	image.name = json.name;
	image.uuid = json.uuid;
	image.format = json.format;
	image.encoding = json.encoding;
	image.data = json.data;
	
	return image;
};
