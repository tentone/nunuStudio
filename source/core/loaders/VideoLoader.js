"use strict";

/**
 * VideoLoader can be used to load external video resources.
 *
 * @class VideoLoader
 * @constructor
 * @module Loaders
 * @param {Object} manager
 */
function VideoLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

/**
 * Load video resource from URL.
 *
 * @method load
 * @param {String} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
VideoLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var self = this;
	
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Parse material JSON.
 *
 * @method parse
 * @param {Object} json
 * @return {Material} material
 */
VideoLoader.prototype.parse = function(json)
{
	var video = new Video(video.data, video.encoding);
	
	video.name = json.name;
	video.uuid = json.uuid;
	video.format = json.format;
	video.encoding = json.encoding;

	return video;
};
