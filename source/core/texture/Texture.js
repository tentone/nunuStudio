import {Image} from "../resources/Image.js";


import {Texture as TTexture, RGBAFormat, RGBFormat, LinearFilter} from "three";


/**
 * Basic image texture object wraps a texture from a img DOM element
 *
 * Support for GIF animations without playback controls.
 * 
 * @class Texture
 * @extends {Texture}
 * @module Textures
 * @param {Image | String} source
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
function Texture(source, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	/**
	 * Source image of the texture.
	 * 
	 * @property source
	 * @type {Image}
	 */
	if(typeof source === "string")
	{
		this.source = new Image(source);
	}
	else if(source === undefined)
	{
		this.source = new Image();
	}
	else
	{
		this.source = source;
	}

	TTexture.call(this, document.createElement("img"), mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
	
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

	this.format = this.source.hasTransparency() ? RGBAFormat : RGBFormat;

	this.updateSource();

	// Check if image is animated format and start an update cycle
	if(this.source.encoding === "gif")
	{
		this.generateMipmaps = false;
		this.magFilter = LinearFilter;
		this.minFilter = LinearFilter;

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

Texture.prototype = Object.create(TTexture.prototype);
Texture.isTexture = true;

/**
 * Should be called after updating the source of the texture.
 *
 * Will copy the source data to the texture for upload to the GPU.
 *
 * @method updateSource
 */
Texture.prototype.updateSource = function()
{
	if(this.source !== null)
	{
		var self = this;

		this.image.crossOrigin = "anonymous";
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
	}
	else
	{
		console.warn("nunuStudio: Texture source is null.");

		this.source.createSolidColor();
		this.image.src = self.source.data;
		this.needsUpdate = true;
	}
};

/**
 * Dispose texture.
 * 
 * @method dispose
 */
Texture.prototype.dispose = function()
{	
	TTexture.prototype.dispose.call(this);

	this.disposed = true;
};

/**
 * Create JSON description for texture, serializes image used in the texture
 * Texture serialization is different inside nunuStudio, the Texture class does not serialize any image data.
 *
 * @param {Object} meta
 * @method toJSON
 */
Texture.prototype.toJSON = function(meta)
{
	var data = TTexture.prototype.toJSON.call(this, meta);
	var image = this.source.toJSON(meta);

	data.image = image.uuid;

	return data;
};

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
/**
 * DOM element attached to the texture
 * 
 * @property image
 * @type {Element}
 */
export {Texture};