import {Texture} from "../../texture/Texture.js";
import {spine} from "spine-runtimes/spine-ts/build/spine-threejs.js"

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
	// TODO <REMOVE>
	console.log(spine);

	spine.Texture.call(this, texture.image);
	
	this.texture = texture;
	this.texture.flipY = false;	
};

SpineTexture.prototype = Object.create(spine.Texture.prototype);

export {SpineTexture};
