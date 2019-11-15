"use strict";

/**
 * A RectAreLight emit light from a rectagular surface.
 * 
 * Based on THREE.RectAreaLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/RectAreaLight
 * 
 * @param {number} color Light color in hex RGB
 * @param {number} intensity Light intensity
 * @param {number} width
 * @param {number} height
 * @class RectAreaLight
 * @extends {RectAreaLight}
 * @module Lights
 */
function RectAreaLight(color, intensity, width, height)
{
	THREE._RectAreaLight.call(this, color, intensity, width, height);

	this.name = "rectarea";
}

THREE._RectAreaLight = THREE.RectAreaLight;
THREE.RectAreaLight = RectAreaLight;

RectAreaLight.prototype = Object.create(THREE._RectAreaLight.prototype);

RectAreaLight.prototype.toJSON = function(meta)
{
	var data = THREE.Light.prototype.toJSON.call(this, meta);

	data.object.width = this.width;
	data.object.height = this.height;

	return data;
};