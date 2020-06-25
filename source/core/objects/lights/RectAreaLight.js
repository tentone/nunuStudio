import {RectAreaLight, Light} from "three";


/**
 * A RectAreLight emit light from a rectagular surface.
 * 
 * Based on RectAreaLight documentation for the object can be found at https:// threejs.org/docs/index.html#Reference/Lights/RectAreaLight
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

THREE._RectAreaLight = RectAreaLight;
RectAreaLight = RectAreaLight;

RectAreaLight.prototype = Object.create(THREE._RectAreaLight.prototype);

RectAreaLight.prototype.toJSON = function(meta)
{
	var data = Light.prototype.toJSON.call(this, meta);

	data.object.width = this.width;
	data.object.height = this.height;

	return data;
};
export {RectAreaLight};