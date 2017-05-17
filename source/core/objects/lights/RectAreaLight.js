"use strict";

/**
 * A RectAreLight emit light from a rectagular surface.
 * 
 * Based on THREE.RectAreaLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/RectAreaLight
 * 
 * @param {Number} color Light color in hex RGB
 * @param {Number} intensity Light intensity
 * @param {Number} width
 * @param {Number} height
 * @class RectAreaLight
 * @extends {RectAreaLight}
 * @module Lights
 * @constructor
 */
function RectAreaLight(color, intensity, width, height)
{
	THREE.RectAreaLight.call(this, color, intensity, width, height);

	this.name = "rectarea";
}

RectAreaLight.prototype = Object.create(THREE.RectAreaLight.prototype);

/**
 * Create JSON description
 * @method toJSON
 * @param {Object} meta
 * @return {Object} JSON descrition
 */
RectAreaLight.prototype.toJSON = function(meta)
{
	var data = THREE.Light.prototype.toJSON.call(this, meta);

	data.object.width = this.width;
	data.object.height = this.height;

	return data;
};