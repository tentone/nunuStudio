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
	THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.category = "Compressed";
	this.image = {width: width, height: height};
	this.mipmaps = mipmaps;
	this.isCubemap = false;

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
	var data = THREE.Texture.prototype.toJSON.call(this, meta);

	data.width = this.image.width;
	data.height = this.image.height;

	data.mipmaps = [];
	for(var i = 0; i < this.mipmaps.length; i++)
	{
		data.mipmaps.push(
		{
			width: this.mipmaps[i].width,
			height: this.mipmaps[i].height,
			data: this.mipmaps[i].data
		});
	}

	return data;
};