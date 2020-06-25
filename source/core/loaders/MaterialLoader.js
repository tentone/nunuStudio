import {Texture} from "../texture/Texture.js";
import {Loaders} from "../../editor/Loaders.js";
import {Text} from "../../editor/components/Text.js";
import {DefaultLoadingManager, MaterialLoader} from "three";

/**
 * MaterialLoader can be used to load external materials.
 *
 * @class MaterialLoader
 * @module Loaders
 * @param {Object} manager
 */
function MaterialLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
	this.textures = {};
}

/**
 * Load material file from URL.
 *
 * @method load
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
MaterialLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var self = this;

	var loader = new FileLoader(self.manager);
	loader.load(url, function(text)
	{
		onLoad(self.parse(JSON.parse(text)));
	}, onProgress, onError);
};

/**
 * Set texture array to be used when loading materials
 *
 * @method setTextures
 * @param {Array} value
 */
MaterialLoader.prototype.setTextures = function(value)
{
	this.textures = value;
};

/**
 * Parse material JSON.
 *
 * @method parse
 * @param {Object} json
 * @return {Material} material
 */
MaterialLoader.prototype.parse = function(json)
{
	var material = MaterialLoader.prototype.parse.call(this, json);

	// Legacy multi-material
	if(json.materials !== undefined)
	{
		for (var i = 0, l = json.materials.length; i < l; i ++)
		{
			material.materials.push(this.parse(json.materials[i]));
		}
	}

	return material;
};
export {MaterialLoader};