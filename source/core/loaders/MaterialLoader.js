"use strict";

/**
 * MaterialLoader can be used to load external materials.
 *
 * @class MaterialLoader
 * @module Loaders
 * @param {Object} manager
 */
function MaterialLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
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
	var textures = this.textures;

	function getTexture(name)
	{
		if(textures[name] === undefined)
		{
			console.warn("THREE.MaterialLoader: Undefined texture", name);
		}

		return textures[name];
	}


	var material = THREE.MaterialLoader.prototype.parse.call(this, json);

	//Specular
	if(json.specular !== undefined)
	{
		if(material.specular === undefined)
		{
			material.specular = new THREE.Color();
		}

		material.specular.setHex(json.specular);
	}

	//Shading
	if(json.shading !== undefined)
	{
		material.flatShading = (json.shading === 1); //THREE.FlatShading
	}

	// Normal scale
	if(json.normalScale !== undefined)
	{
		var normalScale = json.normalScale;

		if(Array.isArray(normalScale) === false)
		{
			//Blender exporter used to export a scalar. See #7459
			normalScale = [normalScale, normalScale];
		}

		material.normalScale = new Vector2().fromArray(normalScale);
	}

	//Multi material
	if(json.materials !== undefined)
	{
		for (var i = 0, l = json.materials.length; i < l; i ++)
		{
			material.materials.push(this.parse(json.materials[i]));
		}
	}

	return material;
};