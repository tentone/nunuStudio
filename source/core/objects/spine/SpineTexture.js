import {ThreeJsTexture} from "@esotericsoftware/spine-threejs";
import {Texture} from "../../texture/Texture.js";

/**
 * Spine animation textures are used alognside with SpineAnimation objects.
 *
 * Each animations sprite atlas uses a SpineTexture object.
 *
 * @class SpineTexture
 * @module Textures
 * @param {Texture} texture Texture to be used inside of this spine texture.
 */
function SpineTexture(texture)
{
	ThreeJsTexture.call(this, texture.image);

	this.texture = texture;
	this.texture.flipY = false;
}

SpineTexture.prototype = Object.create(ThreeJsTexture.prototype);

export {SpineTexture};
