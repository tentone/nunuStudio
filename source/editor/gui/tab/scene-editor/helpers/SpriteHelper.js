import {Object3D, Sprite, SpriteMaterial, Mesh} from "three";

/** 
 * Sprite helper is used to preview sprite objects.
 *
 * @class SpriteHelper
 * @param {Object3D} object
 * @param {number} hex Helper color in hexadecimal.
 */
function SpriteHelper(object, hex) 
{
	Sprite.call(this, new SpriteMaterial(
		{color: hex !== undefined ? hex : 0xFFFFFF}));

	/**
	 * Object attached to the helper
	 *
	 * @attribute object
	 * @type {Object3D}
	 */
	this.object = object;
	
	this.matrixAutoUpdate = false;
	this.update();
}

SpriteHelper.prototype = Object.create(Mesh.prototype);

SpriteHelper.prototype.update = function()
{
	this.matrixWorld.copy(this.object.matrixWorld);
};
export {SpriteHelper};
