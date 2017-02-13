"use strict";

/**
 * CubeTextures represent 360 view using six images, these images correspond to the faces of a cube
 * CubeTextures can be used to simulate reflections and transparency refraction in materials
 * Is also possible to create dynamic cubetextures using the CubeCamera object
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
function CubeTexture(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding)
{
	if(mapping === undefined)
	{
		mapping = THREE.CubeReflectionMapping;
	}

	if(images === undefined)
	{
		images = [];
	}
	
	var array = [];
	var self = this;
	for(var i = 0; i < images.length; i++)
	{
		if(typeof images[i] === "string")
		{
			images[i] = new Image(images[i]);
		}

		var element = document.createElement("img");
		element.src = images[i].data;
		element.onload = function()
		{
			self.needsUpdate = true;
		};

		array.push(element);
	}	

	THREE.Texture.call(this, array, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

	this.images = images;
	this.flipY = false;

	this.name = "cubetexture";
	this.category = "Cube";
}

CubeTexture.prototype = Object.create(Texture.prototype);

CubeTexture.prototype.isCubeTexture = true;

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

	data.images = [];

	for(var i = 0; i < this.images.length; i++)
	{	
		var image = this.images[i].toJSON(meta);
		data.images.push(image.uuid);
	}

	return data;
}