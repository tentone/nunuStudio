"use strict";


/**
 * CompressTexture class is used to store textures using GPU compatible compressed data.
 *
 * The advantage of using these texture is the fact that the texture does not get uncompressed in the GPU memory saving not only project space but also saving video memory during runtime.
 *
 * @class CompressedTexture
 * @constructor
 * @extends {Texture}
 * @param {Array} mipmaps Mipmaps levels
 * @param {Number} width
 * @param {Number} height
 * @param {Number} format
 * @param {Number} type
 * @param {Number} mapping
 * @param {Number} wrapS
 * @param {Number} wrapT
 * @param {Number} magFilter
 * @param {Number} minFilter
 * @param {Number} anisotropy
 * @param {Number} encoding
 */
function CompressedTexture(mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding)
{
	Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.image = {width: width, height: height};
	this.mipmaps = mipmaps;

	Object.defineProperties(this,
	{
		flipY:
		{
			get: function(){return false},
			set: function(value){}
		},
		generateMipmaps:
		{
			get: function(){return false},
			set: function(value){}
		}
	});
}

CompressedTexture.prototype = Object.create(Texture.prototype);

CompressedTexture.prototype.isCompressedTexture = true;

CompressedTexture.prototype.toJSON = function(meta)
{
	var data = Texture.prototype.toJSON.call(this, meta);

	console.log(this.image);
	console.log(this.mipmaps);

	return data;
};