"use strict";

/**
 * Audio loader can be used to load external audio resources.
 * 
 * @class AudioLoader
 * @constructor
 * @module Loaders
 * @param {Object} manager
 */
function AudioLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
}

/**
 * Load audio file from URL.
 *
 * @method load
 * @param {String} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
AudioLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Parse audio json and return resource.
 *
 * @method parse
 * @param {Object} json
 * @return {Audio} Audio resource
 */
AudioLoader.prototype.parse = function(json)
{
	var audio = new Audio();

	audio.name = json.name;
	audio.uuid = json.uuid;
	audio.encoding = json.encoding;

	if(json.format === "base64")
	{
		audio.format = "arraybuffer";
		audio.data = ArraybufferUtils.fromBase64(json.data);
	}
	else
	{
		audio.format = json.format;
		audio.data = json.data;
	}

	console.log("AudioLoader parser JSON input", json);
	console.log("AudioLoader parser Result output", audio);

	return audio;
};
