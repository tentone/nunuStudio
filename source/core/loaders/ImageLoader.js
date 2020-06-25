import {Image} from "../resources/Image.js";
import {Loaders} from "../../editor/Loaders.js";
import {DefaultLoadingManager, FileLoader} from "three";

/**
 * ImageLoader can be used to load external image resources.
 *
 * @class ImageLoader
 * @module Loaders
 * @param {Object} manager
 */
function ImageLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;

	this.path = "";
	this.crossOrigin = "Anonymous";
}

/**
 * Set cross origin path for the loader.
 * 
 * @method setCrossOrigin
 * @param {string} url URL.
 * @return {ImageLoader} Self for chaining.
 */
ImageLoader.prototype.setCrossOrigin = function(url)
{
	this.crossOrigin = url;
	return this;
};

/**
 * Set base path for texture loading.
 * 
 * @method setPath
 * @param {string} path Path
 * @return {ImageLoader} Self for chaining.
 */
ImageLoader.prototype.setPath = function(path)
{
	this.path = path;
	return this;
};

/**
 * Load image resource from url.
 *
 * @method loadJSON
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
ImageLoader.prototype.loadJSON = function(url, onLoad, onProgress, onError)
{
	var self = this;
	
	var loader = new FileLoader(this.manager);
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
	var image = new Image((json.data.toArrayBuffer !== undefined) ? json.data.toArrayBuffer() : json.data, json.encoding);
	
	image.name = json.name;
	image.uuid = json.uuid;

	if(json.width !== undefined)
	{
		image.width = json.width;
		image.height = json.height;
	}

	return image;
};

export {ImageLoader};