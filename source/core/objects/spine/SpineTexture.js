import {Texture} from "../../../texture/Texture.js";
import {Text} from "../../../../editor/components/Text.js";


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
	spine.threejs.ThreeJsTexture.call(this, texture.image);
	
	this.texture = texture;
	this.texture.flipY = false;	
};

SpineTexture.prototype = Object.create(spine.threejs.ThreeJsTexture.prototype);
export {SpineTexture};