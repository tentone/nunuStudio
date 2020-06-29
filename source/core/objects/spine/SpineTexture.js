import {Texture} from "../../texture/Texture.js";
import {ThreeJsTexture} from "spine-runtimes/spine-ts/threejs/src/ThreeJsTexture"

/**
 * Spine animation textures adapted to work with nunuStudio textures.
 * 
 * Based on SpineTexture from original spine runtime for three.js
 * 
 * @class SpineTexture
 * @module Textures
 * @param {Texture} texture
 */
function SpineTexture(texture)
{
	ThreeJsTexture.call(this, texture.image);
	
	this.texture = texture;
	this.texture.flipY = false;	
};

SpineTexture.prototype = Object.create(ThreeJsTexture.prototype);

export {SpineTexture};