"use strict";

/**
 * CubeTextures represent 360 view using six images, these images correspond to the faces of a cube.
 * 
 * CubeTextures can be used to simulate reflections and transparency refraction in materials.
 * 
 * Is also possible to create dynamic cubetextures using the CubeCamera object.
 *
 * @class CubeTexture
 * @constructor
 * @extends {Texture}
 * @param {Array} images Image array with 6 images
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
 * Size of each on of the texture that composte the CubeTexture
 *
 * @property size
 * @type {Number}
 * @default 512
 */
function CubeTexture(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	if(mapping === undefined)
	{
		mapping = THREE.CubeReflectionMapping;
	}

	var array = [];
	for(var i = 0; i < 6; i++)
	{
		array.push(document.createElement("canvas"));
	}	

	THREE.Texture.call(this, array, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.images = (images !== undefined) ? images : [];

	this.size = 512;
	this.flipY = false;

	this.updateImages();

	this.name = "cubetexture";
	this.category = "Cube";
}

CubeTexture.prototype = Object.create(THREE.Texture.prototype);

CubeTexture.prototype.isCubeTexture = true;

/**
 * Cubemap right image index
 *
 * @attribute RIGHT
 * @type {Number}
 */
CubeTexture.RIGHT = 0;

/**
 * Cubemap left image index
 *
 * @attribute LEFT
 * @type {Number}
 */
CubeTexture.LEFT = 1;

/**
 * Cubemap top image index
 *
 * @attribute TOP
 * @type {Number}
 */
CubeTexture.TOP = 2;

/**
 * Cubemap bottom image index
 *
 * @attribute BOTTOM
 * @type {Number}
 */
CubeTexture.BOTTOM = 3;

/**
 * Cubemap front image index
 *
 * @attribute FRONT
 * @type {Number}
 */
CubeTexture.FRONT = 4;

/**
 * Cubemap back image index
 *
 * @attribute BACK
 * @type {Number}
 */
CubeTexture.BACK = 5;

/**
 * Updates the CubeTexture images, should be called after changing the images attached to the texture
 * 
 * @method updateImages
 */
CubeTexture.prototype.updateImages = function()
{
	var self = this;

	for(var i = 0; i < this.images.length; i++)
	{
		if(typeof this.images[i] === "string")
		{
			this.images[i] = new Image(this.images[i]);
		}

		var image = document.createElement("img");
		image.index = i;
		image.src = this.images[i].data;
		image.onload = function()
		{
			self.image[this.index].width = self.size;
			self.image[this.index].height = self.size;

			var context = self.image[this.index].getContext("2d");
			context.drawImage(this, 0, 0, self.size, self.size);

			self.needsUpdate = true;
		};
	}
};

/**
 * Serialize cube texture to JSON
 * All six images of the cube texture are stored individually
 * 
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
CubeTexture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);

	data.size = this.size;
	data.images = [];
	for(var i = 0; i < this.images.length; i++)
	{	
		var image = this.images[i].toJSON(meta);
		data.images.push(image.uuid);
	}

	return data;
};
