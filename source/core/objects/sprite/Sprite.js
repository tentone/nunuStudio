import {Sprite as TSprite, Object3D} from "three";

/**
 * Sprites allways face the screen are used for 2D elements.
 * 
 * Based on Sprite documentation for the object can be found at https:// threejs.org/docs/index.html#Reference/Objects/Sprite.
 * 
 * @class Sprite
 * @module Sprite
 * @param {Material} material Material used to draw sprites
 * @extends {Script}
 */

/**
 * Material used to render the sprite.
 * @property material
 * @type {Material}
*/
function Sprite(material)
{
	TSprite.call(this, material);

	this.name = "sprite";
}

Sprite.prototype = Object.create(TSprite.prototype);

Sprite.prototype.dispose = function()
{
	if(this.material !== null && this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	
	Object3D.prototype.dispose.call(this);
};

export {Sprite};
