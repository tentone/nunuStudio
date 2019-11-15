"use strict";

/** 
 * Point helper is used to preview THREE.Points objects.
 * 
 * @class PointsHelper
 * @param {THREE.Points} object
 * @param {number} hex Helper color in hexadecimal.
 */
function PointsHelper(object, hex)
{
	THREE.Points.call(this, object.geometry, object.material.clone());

	this.material.color = new THREE.Color((hex !== undefined) ? hex : 0xFFFF00);
	this.material.size = object.material.size * 1.2;

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

PointsHelper.prototype = Object.create(THREE.Points.prototype);

PointsHelper.prototype.update = function()
{
	this.geometry = this.object.geometry;
	this.matrix.copy(this.object.matrixWorld);
};
