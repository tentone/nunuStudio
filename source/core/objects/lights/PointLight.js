"use strict";

/**
 * Same as THREE.PointLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/PointLight
 * @param {Number} hex Light color in hex RGB
 * @param {Number} intensity Light intensity
 * @param {Number} distance Maximum PointLight range
 * @param {Number} decay
 * @class PointLight
 * @extends {PointLight}
 * @module Lights
 * @constructor
 */
function PointLight(hex, intensity, distance, decay)
{
	THREE.PointLight.call(this, hex, intensity, distance, decay);

	this.name = "point";
	
	this.castShadow = true;

	this.shadow.camera.near = 0.05;
	this.shadow.camera.far = 5000;
	this.shadow.bias = 0.01;
}

PointLight.prototype = Object.create(THREE.PointLight.prototype);

/**
 * Update light shadow map atributtes at runtime
 * @method updateShadowMap
 */
PointLight.prototype.updateShadowMap = function()
{
	this.shadow.map.dispose();
	this.shadow.map = null;
	this.shadow.camera.updateProjectionMatrix();
}
