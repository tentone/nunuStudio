"use strict";

/**
 * Image texture constructor, supports GIF animations.
 * 
 * It is based on THREE.Texture, original documentation can be found here https://threejs.org/docs/index.html#Reference/Textures/Texture
 * 
 * @class Texture
 * @constructor
 * @extends {Texture}
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

/**
 * Image attached to the texture
 * 
 * @property img
 * @type {Image}
 */
/**
 * DOM element attached to the texture
 * 
 * @property image
 * @type {DOM}
 */
/**
 * Name of the texture
 * 
 * @property name
 * @type {String}
 * @default "texture"
 */
/**
 * Flag used to know is the texture has been disposed.
 * 
 * Is used to control animation when using a gif as a texture.
 * 
 * @property disposed
 * @type {boolean}
 * @default false
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

	//Super constructor
	THREE.Texture.call(this, document.createElement("img"), mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	var self = this;

	this.name = "texture";
	this.category = "Image";
	this.disposed = false;
	this.format = this.img.hasTransparency() ? THREE.RGBAFormat : THREE.RGBFormat;

	//Image source
	this.image.src = this.img.data;
	this.image.onload = function()
	{
		self.needsUpdate = true;
	}

	//Check if image is animated
	if(this.img.encoding === "gif")
	{
		function update()
		{
			if(!self.disposed)
			{
				self.needsUpdate = true;
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
};

/**
 * Create JSON description for texture, serializes image used in the texture
 * THREE.Texture serialization is different inside nunuStudio, the THREE.Texture class does not serialize any image data.
 * @param {Object} meta
 * @method toJSON
 */
Texture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);
	var image = this.img.toJSON(meta);

	data.image = image.uuid;

	return data;
};
