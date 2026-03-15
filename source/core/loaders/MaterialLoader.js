import {DefaultLoadingManager, MaterialLoader as TMaterialLoader} from "three";

/**
 * MaterialLoader can be used to load external materials.
 *
 * @class MaterialLoader
 * @module Loaders
 * @param {Object} manager
 */
class MaterialLoader
{
	constructor(manager)
	{
		this.manager = manager !== undefined ? manager : DefaultLoadingManager;
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
	load(url, onLoad, onProgress, onError)
	{
		var self = this;

		var loader = new FileLoader(self.manager);
		loader.load(url, function(text)
		{
			onLoad(self.parse(JSON.parse(text)));
		}, onProgress, onError);
	}

	/**
	 * Set texture array to be used when loading materials
	 *
	 * @method setTextures
	 * @param {Array} value
	 */
	setTextures(value)
	{
		this.textures = value;
	}

	/**
	 * Parse material JSON.
	 *
	 * @method parse
	 * @param {Object} json
	 * @return {Material} material
	 */
	parse(json)
	{
		const loader = new TMaterialLoader();
		loader.setTextures(this.textures);
		var material = loader.parse(json);

		// Legacy multi-material
		if (json.materials !== undefined)
		{
			for (var i = 0, l = json.materials.length; i < l; i ++)
			{
				material.materials.push(this.parse(json.materials[i]));
			}
		}

		return material;
	}
}
export {MaterialLoader};
