"use strict";

/**
 * Data texture stored binary RAW texture data values.
 *
 * Can be used to store render target result or to load custom image formats. Pixels can be manipulated individually in the data array.
 *
 * @class DataTexture
 * @extends {THREE.Texture}
 * @param {Array} data Image data array
 * @param {number} width
 * @param {number} height
 * @param {number} format
 * @param {number} type
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
function DataTexture(data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding)
{
	THREE.Texture.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.image = { data: data || null, width: width || 1, height: height || 1 };

	this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
	this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

	this.generateMipmaps = false;
	this.flipY = false;
	this.unpackAlignment = 1;

	this.needsUpdate = true;
}

DataTexture.prototype = Object.create(THREE.Texture.prototype);
DataTexture.prototype.constructor = DataTexture;
DataTexture.prototype.isDataTexture = true;
