"use strict";

/**
 * Geometry loader can be used to load geometry files.
 * 
 * @class GeometryLoader
 * @constructor
 * @module Loaders
 * @param {Object} manager
 */
function GeometryLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

/**
 * Load geometry json file from URL.
 *
 * @method load
 * @param {String} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
GeometryLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Parse geometry json.
 *
 * @method parse
 * @param {Object} json
 * @return {Geometry} Geometry loaded from json.
 */
GeometryLoader.prototype.parse = function(json)
{
	//TODO <ADD CODE HERE>
};
