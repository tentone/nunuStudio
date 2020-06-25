"use strict";

/** 
 * Wireframe helper is used to preview drawable objects.
 * 
 * Every line is drawn individually, usefull to analyse the geometry in detail.
 *
 * @class WireframeHelper
 * @param {THREE.Object3D} object
 * @param {number} hex Helper color in hexadecimal.
 */
function WireframeHelper(object, hex) 
{
	THREE.Mesh.call(this, object.geometry, new THREE.MeshBasicMaterial(
	{
		color: (hex !== undefined) ? hex : 0xFFFFFF,
		wireframe: true
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

WireframeHelper.prototype = Object.create(THREE.Mesh.prototype);

WireframeHelper.prototype.update = function()
{
	this.geometry = this.object.geometry;
	this.matrix.copy(this.object.matrixWorld);
};