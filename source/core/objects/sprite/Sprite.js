import {Sprite as TSprite, Object3D} from "three";

/**
 * Sprites always face the screen are used for 2D elements.
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
 *
 * @property material
 * @type {Material}
 */
class Sprite extends TSprite
{
	constructor(material)
	{
		super(material);

		this.name = "sprite";
	}

	dispose()
	{
		if (this.material !== null && this.material.dispose !== undefined)
		{
			this.material.dispose();
		}

		Object3D.prototype.dispose.call(this);
	}
}

export {Sprite};
