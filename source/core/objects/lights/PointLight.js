import {PointLight as TPointLight} from "three";


/**
 * PointLights emit light from a single point in all directions.
 * 
 * Based on PointLight documentation for the object can be found at https:// threejs.org/docs/index.html#Reference/Lights/PointLight
 * 
 * @param {number} hex Light color in hex RGB
 * @param {number} intensity Light intensity
 * @param {number} distance Maximum PointLight range
 * @param {number} decay
 * @class PointLight
 * @extends {PointLight}
 * @module Lights
 */
function PointLight(hex, intensity, distance, decay)
{
	TPointLight.call(this, hex, intensity, distance, decay);

	this.name = "point";
	
	this.castShadow = true;

	this.shadow.camera.near = 0.1;
	this.shadow.camera.far = 1000;
	this.shadow.bias = 0.0;
}

TPointLight = PointLight;
PointLight = PointLight;

PointLight.prototype = Object.create(TPointLight.prototype);

/**
 * Update light shadow map atributtes at runtime
 * @method updateShadowMap
 */
PointLight.prototype.updateShadowMap = function()
{
	this.shadow.map.dispose();
	this.shadow.map = null;
	this.shadow.camera.updateProjectionMatrix();
};
export {PointLight};