import {Object3D, Sprite, SpriteMaterial, Mesh} from "three";

/** 
 * Sprite helper is used to preview sprite objects.
 *
 * @class SpriteHelper
 * @param {Object3D} object
 * @param {number} hex Helper color in hexadecimal.
 */
class SpriteHelper extends Mesh {
	constructor(object, hex) {
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

	update() {
	this.matrixWorld.copy(this.object.matrixWorld);
	}

}
export {SpriteHelper};
