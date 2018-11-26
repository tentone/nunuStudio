"use strict";

/** 
 * Sprite helper is used to preview sprite objects.
 *
 * @class SpriteHelper
 * @param {THREE.Object3D} object
 * @param {Number} hex Helper color in hexadecimal.
 */
function SpriteHelper(object, hex) 
{
	THREE.Sprite.call(this, new THREE.SpriteMaterial(
	{
		color: hex !== undefined ? hex : 0xFFFFFF
	}));

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

SpriteHelper.prototype = Object.create(THREE.Mesh.prototype);

SpriteHelper.prototype.update = function()
{
	this.matrixWorld.copy(this.object.matrixWorld);
};