import {Texture} from "three";

/**
 * CompressTexture class is used to store textures using GPU compatible compressed data.
 *
 * The advantage of using these texture is the fact that the texture does not get uncompressed in the GPU memory saving not only project space but also saving video memory during runtime.
 *
 * The problem with compressed textures is that its hardware dependent (they dont work everywhere)
 *  - DXT: supported on desktop and some Android smartphones
 *  - PVR: supported on iOS and some Android smartphones
 *  - ETC1: supported by most Android smartphones
 *
 * The usage of these format can free a lot of video memory and is a must for mobile devices.
 * 
 * @class CompressedTexture
 * @extends {Texture}
 * @param {Array} mipmaps Mipmaps levels
 * @param {number} width
 * @param {number} height
 * @param {number} format
 * @param {number} type
 * @param {number} mapping
 * @param {number} wrapS
 * @param {number} wrapT
 * @param {number} magFilter
 * @param {number} minFilter
 * @param {number} anisotropy
 * @param {number} encoding
 */
function CompressedTexture(mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding)
{
	Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.category = "Compressed";

	this.image = {width: width, height: height};
	this.mipmaps = mipmaps;
	this.isCubeTexture = false;

	this.flipY = false;
	this.generateMipmaps = false;
}

CompressedTexture.prototype = Object.create(Texture.prototype);
CompressedTexture.prototype.constructor = CompressedTexture;
CompressedTexture.prototype.isCompressedTexture = true;

CompressedTexture.prototype.toJSON = function(meta)
{
	var data = Texture.prototype.toJSON.call(this, meta);

	data.isCubeTexture = this.isCubeTexture;

	if (this.isCubeTexture)
	{
		data.image = [];

		for (var j = 0; j < this.image.length; j++)
		{	
			var image = 
			{
				mipmaps: [],
				format: this.image[j].format,
				width: this.image[j].width,
				height: this.image[j].height
			};

			for (var i = 0; i < this.image[j].mipmaps.length; i++)
			{
				image.mipmaps.push(
					{
						width: this.image[j].mipmaps[i].width,
						height: this.image[j].mipmaps[i].height,
						data: this.image[j].mipmaps[i].data
					});
			}
			
			data.image.push(image);
		}
	}
	else
	{
		data.mipmaps = [];
		data.width = this.image.width;
		data.height = this.image.height;
		for (var i = 0; i < this.mipmaps.length; i++)
		{
			data.mipmaps.push(
				{
					width: this.mipmaps[i].width,
					height: this.mipmaps[i].height,
					data: this.mipmaps[i].data
				});
		}
	}

	return data;
};
export {CompressedTexture};
