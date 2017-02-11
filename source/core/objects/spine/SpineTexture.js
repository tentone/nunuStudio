"use strict";

/**
 * Spine animation textures
 * Based on SpineTexture from original spine runtime for three.js
 * 
 * @class SpineTexture
 * @module Textures
 * @constructor
 * @param {Texture} texture
 */

function SpineTexture(texture)
{
	spine.Texture.call(this, texture.image);
	
	this.texture = texture;
	this.texture.flipY = false;
}

SpineTexture.prototype = Object.create(spine.Texture.prototype);

SpineTexture.prototype.setFilters = function (minFilter, magFilter)
{
	this.texture.minFilter = SpineTexture.getTextureFilter(minFilter);
	this.texture.magFilter = SpineTexture.getTextureFilter(magFilter);
}

SpineTexture.prototype.setWraps = function (uWrap, vWrap)
{
	this.texture.wrapS = SpineTexture.getTextureWrap(uWrap);
	this.texture.wrapT = SpineTexture.getTextureWrap(vWrap);
}

SpineTexture.prototype.dispose = function()
{
	this.texture.dispose();
}

SpineTexture.getTextureFilter = function(filter)
{
	if(filter === spine.TextureFilter.Linear)
	{
		return THREE.LinearFilter;
	}
	else if(filter === spine.TextureFilter.MipMap)
	{
		return THREE.LinearMipMapLinearFilter;
	}
	else if(filter === spine.TextureFilter.MipMapLinearLinear)
	{
		return THREE.LinearMipMapLinearFilter;
	}
	else if(filter === spine.TextureFilter.MipMapLinearNearest)
	{
		return THREE.LinearMipMapNearestFilter;
	}
	else if(filter === spine.TextureFilter.MipMapNearestLinear)
	{
		return THREE.NearestMipMapLinearFilter;
	}
	else if(filter === spine.TextureFilter.MipMapNearestNearest)
	{
		return THREE.NearestMipMapNearestFilter;
	}
	else if(filter === spine.TextureFilter.Nearest)
	{
		return THREE.NearestFilter;
	}

	return null;
}

SpineTexture.getTextureWrap = function(wrap)
{
	if(wrap === spine.TextureWrap.ClampToEdge)
	{
		return THREE.ClampToEdgeWrapping;
	}
	else if(wrap === spine.TextureWrap.MirroredRepeat)
	{
		return THREE.MirroredRepeatWrapping;
	}
	else if(wrap === spine.TextureWrap.Repeat)
	{
		return THREE.RepeatWrapping;
	}
}