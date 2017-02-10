"use strict";

/**
 * Image texture constructor, supports GIF animations
 * It is based on THREE.Texture, original documentation can be found here https://threejs.org/docs/index.html#Reference/Textures/Texture
 * 
 * @class Texture
 * @constructor
 * @extends {THREE.Texture}
 * @module Textures
 * @param {Image} image
 * @param {Number} mapping
 * @param {Number} wrapS
 * @param {Number} wrapT
 * @param {Number} magFilter
 * @param {Number} minFilter
 * @param {Number} format
 * @param {Number} type
 * @param {Number} anisotropy
 * @param {Number} encoding
 */
function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	//If image is a URL
	if(typeof image === "string")
	{
		this.img = new Image(image);
	}
	else if(image === undefined)
	{
		this.img = new Image();
	}
	else
	{
		this.img = image;
	}

	//Texture constructor
	THREE.Texture.call(this, document.createElement("img"), mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	//If the image is not transparent use RBG instead of RGBA to save space
	var transparent = this.img.encoding === "png" || this.img.encoding === "gif";
	var texture = this;

	this.name = "texture";
	this.category = "Image";
	this.disposed = false;
	this.format = transparent ? THREE.RGBAFormat : THREE.RGBFormat;

	//Set image source
	this.image.src = this.img.data;
	this.image.onload = function()
	{
		texture.needsUpdate = true;
	}

	//Check if image is animated
	if(this.img.encoding === "gif")
	{
		function update()
		{
			if(!texture.disposed)
			{
				texture.needsUpdate = true;
				requestAnimationFrame(update);
			}
		};
		update();
	}
}

Texture.prototype = Object.create(THREE.Texture.prototype);

/**
 * Dispose texture
 * @method dispose
 */
Texture.prototype.dispose = function()
{	
	THREE.Texture.prototype.dispose.call(this);

	this.disposed = true;
}

/**
 * Create JSON description for texture, serializes image used in the texture
 * @param {Object} meta
 * @method toJSON
 */
Texture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);
	var image = this.img.toJSON(meta);

	data.image = image.uuid;

	return data;
}