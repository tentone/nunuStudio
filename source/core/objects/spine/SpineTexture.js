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
class SpineTexture extends ThreeJsTexture
{
	constructor(texture)
	{
		super(texture.image);

		this.texture = texture;
		this.texture.flipY = false;
	}
}

export {SpineTexture};
