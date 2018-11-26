"use strict";

/** 
 * Object icon helper is used to display the icon of an object.
 * 
 * @class ObjectIconHelper
 * @param {THREE.Object3D} object
 * @param {String) icon Icon URL.
 */
function ObjectIconHelper(object, icon)
{
	var self = this;

	var element = document.createElement("img");
	var texture = new THREE.Texture(element);
	element.onload = function()
	{
		self.ratio = this.naturalWidth / this.naturalHeight;
		texture.needsUpdate = true;
	};
	element.src = icon;

	THREE.Sprite.call(this, new THREE.SpriteMaterial(
	{
		map: texture,
		opacity: 0.8,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		sizeAttenuation: false,
		alphaTest: 0.2
	}));

	/**
	 * Object attached to the helper
	 *
	 * @attribute object
	 * @type {Object3D}
	 */
	this.object = object;

	/**
	 * Icon aspect ratio.
	 *
	 * @attribute ratio
	 * @type {Number}
	 */
	this.ratio = 1.0;

	/**
	 * Size of the helper.
	 *
	 * @attribute size
	 * @type {Number}
	 */
	this.size = 0.1;

	this.matrixAutoUpdate = false;
}

ObjectIconHelper.prototype = Object.create(THREE.Sprite.prototype);

ObjectIconHelper.prototype.update = function()
{
	//Position
	this.matrix.elements[12] = this.object.matrixWorld.elements[12];
	this.matrix.elements[13] = this.object.matrixWorld.elements[13];
	this.matrix.elements[14] = this.object.matrixWorld.elements[14];

	//Scale
	this.matrix.elements[0] = this.size;
	this.matrix.elements[5] = this.size / this.ratio;
	this.matrix.elements[10] = this.size;
};