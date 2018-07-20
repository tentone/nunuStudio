"use strict";

/** 
 * Point helper is used to preview THREE.Points objects.
 * 
 * @class PointsHelper
 * @param {THREE.Points} object
 * @param {Number} hex Helper color in hexadecimal.
 */
function PointsHelper(object, hex)
{
	THREE.Points.call(this, object.geometry, object.material.clone());

	this.material.color = new THREE.Color((hex !== undefined) ? hex : 0xFFFF00);
	this.material.size = object.material.size * 1.2;

	this.object = object;
	this.matrixAutoUpdate = false;
	
	this.update();
}

PointsHelper.prototype = Object.create(THREE.Points.prototype);

PointsHelper.prototype.update = function()
{
	this.matrixWorld = this.object.matrixWorld;
	this.matrix = this.object.matrix;
};