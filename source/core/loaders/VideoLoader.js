import {Video} from "../../resources/Video.js";
import {Loaders} from "../../../editor/Loaders.js";
import {DefaultLoadingManager, FileLoader} from "three";

/**
 * VideoLoader can be used to load external video resources.
 *
 * @class VideoLoader
 * @module Loaders
 * @param {Object} manager
 */
function VideoLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
}

/**
 * Load video resource from URL.
 *
 * @method load
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
VideoLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var self = this;
	
	var loader = new FileLoader(this.manager);
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
	var video = new Video((json.data.toArrayBuffer !== undefined) ? json.data.toArrayBuffer() : json.data, json.encoding);
	
	video.name = json.name;
	video.uuid = json.uuid;
	
	return video;
};

export {VideoLoader};