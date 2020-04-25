"use strict";

/**
 * Image texture constructor, with support for GIF animations.
 * 
 * It is based on THREE.Texture, original documentation can be found here https:// threejs.org/docs/index.html#Reference/Textures/Texture
 * 
 * @class Texture
 * @extends {Texture}
 * @module Textures
 * @param {Image} image
 * @param {number} mapping
 * @param {number} wrapS
 * @param {number} wrapT
 * @param {number} magFilter
 * @param {number} minFilter
 * @param {number} format
 * @param {number} type
 * @param {number} anisotropy
 * @param {number} encoding
 */
/**
 * UUID of this object instance. This gets automatically assigned, so this shouldn't be edited.
 * @property uuid
 * @type {string}
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
 * @type {number}
 * @default 0
 */
/**
 * False by default, which is the norm for PNG images. Set to true if the RGB values have been stored premultiplied by alpha.
 *
 * @property premultiplyAlpha
 * @type {boolean}
 */
/**
 * Flips the image's Y axis to match the WebGL texture coordinate space.
 *
 * @property flipY
 * @type {boolean}
 */
/**
 * Array of user-specified mipmaps (optional).
 *
 * @property mipmaps
 * @type {Array}
 */
function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	/**
	 * Image attached to the texture
	 * 
	 * @property img
	 * @type {Image}
	 */
	if(typeof image === "string")
	{
		this.source = new Image(image);
	}
	else if(image === undefined)
	{
		this.source = new Image();
	}
	else
	{
		this.source = image;
	}

	THREE.Texture.call(this, document.createElement("img"), mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
	
	var self = this;

	/**
	 * Name of the texture (doesn't need to be unique).
	 * @property name
	 * @type {string}
	*/
	this.name = "texture";
	this.category = "Image";

	/**
	 * Flag used to know is the texture has been disposed.
	 * 
	 * Is used to control animation when using a gif as a texture.
	 * 
	 * @property disposed
	 * @type {boolean}
	 * @default false
	 */
	this.disposed = false;

	this.format = this.source.hasTransparency() ? THREE.RGBAFormat : THREE.RGBFormat;

	/**
	 * DOM element attached to the texture
	 * 
	 * @property image
	 * @type {Element}
	 */
	// this.image.crossOrigin = "Anonymous";
	this.image.src = this.source.data;
	this.image.onload = function()
	{
		self.needsUpdate = true;
	};
	this.image.onerror = function()
	{
		console.log("nunuStudio: Failed to load image " + self.source.uuid + " data.");
		self.source.createSolidColor();
		self.image.src = self.source.data;
		self.needsUpdate = true;
	};

	// Check if image is animated
	if(this.source.encoding === "gif")
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
Texture.isTexture = true;

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
	var image = this.source.toJSON(meta);

	data.image = image.uuid;

	return data;
};
