"use strict";

/**
 * Image texture constructor, with support for GIF animations.
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
 * Name of the texture (doesn't need to be unique).
 * @property name
 * @type {String}
*/
/**
 * UUID of this object instance. This gets automatically assigned, so this shouldn't be edited.
 * @property uuid
 * @type {String}
 */
/**
 * How much a single repetition of the texture is offset from the beginning, in each direction U and V.
 * 
 * @property offset
 * @type {Vector2}
 */
/**
 * How many times the texture is repeated across the surface, in each direction U and V.  If repeat is set greater than 1 in either direction, the corresponding Wrap parameter should also be set to .
 * 
 * @property repeat
 * @type {Vector2}
 */
/**
 * Indicates where the center of rotation is. To rotate around the center point set this value to (0.5, 0.5).
 * 
 * @property center
 * @type {Vector2}
 */
/**
 * How much the texture is rotated around the center point, in radians. Postive values are counter-clockwise.
 *
 * @property rotation
 * @type {Number}
 * @default 0
 */
/**
 * Image attached to the texture
 * 
 * @property img
 * @type {Image}
 */
/**
 * False by default, which is the norm for PNG images. Set to true if the RGB values have been stored premultiplied by alpha.
 *
 * @property premultiplyAlpha
 * @type {Boolean}
 */
/**
 * Flips the image's Y axis to match the WebGL texture coordinate space.
 *
 * @property flipY
 * @type {Boolean}
 */
/**
 * DOM element attached to the texture
 * 
 * @property image
 * @type {DOM}
 */
/**
 * Array of user-specified mipmaps (optional).
 *
 * @property mipmaps
 * @type {Array}
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
	};

	this.image.onerror = function()
	{
		console.log("nunuStudio: Failed to load image " + self.img.uuid + " data.");
		self.img.createSolidColor();
		self.image.src = self.img.data;
	};

	//Check if image is animated
	if(this.img.encoding === "gif")
	{
		this.generateMipmaps = false;
		this.magFilter = THREE.LinearFilter;
		this.minFilter = THREE.LinearFilter;

		function update()
		{
			if(!self.disposed)
			{
				self.needsUpdate = true;
				requestAnimationFrame(update);
			}
		}
		
		update();
	}
}

Texture.prototype = Object.create(THREE.Texture.prototype);

/**
 * Dispose texture.
 * 
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
 *
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
