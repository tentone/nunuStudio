"use strict";

/**
 * Sprites allways face the screen are used for 2D elements.
 * 
 * Based on THREE.Sprite documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Objects/Sprite.
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
	THREE._Sprite.call(this, material);

	this.name = "sprite";
}

THREE._Sprite = THREE.Sprite;
THREE.Sprite = Sprite;

Sprite.prototype = Object.create(THREE._Sprite.prototype);

/**
 * Dispose the sprite material.
 * 
 * @method dispose
 */
Sprite.prototype.dispose = function()
{
	if(this.material !== null && this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	
	THREE.Object3D.prototype.dispose.call(this);
};
