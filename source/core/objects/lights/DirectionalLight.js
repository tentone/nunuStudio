"use strict";

/**
 * A light that gets emitted in a specific direction.
 * 
 * This light will behave as though it is infinitely far away and the rays produced from it are all parallel.
 * 
 * Based on THREE.DirectionalLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/DirectionalLight
 * 
 * @param {Number} hex Light color in hex RGB
 * @param {Number} intensity Light intensity
 * @class DirectionalLight
 * @extends {DirectionalLight}
 * @module Lights
 * @constructor
 */
function DirectionalLight(hex, intensity)
{
	THREE.DirectionalLight.call(this, hex, intensity);

	this.name = "directional";
	
	this.castShadow = true;
	
	this.shadow.camera.near = 0.5;
	this.shadow.camera.far = 10000;
}

DirectionalLight.prototype = Object.create(THREE.DirectionalLight.prototype);

/**
 * Update light shadow map atributtes at runtime
 * @method updateShadowMap
 */
DirectionalLight.prototype.updateShadowMap = function()
{
	this.shadow.map.dispose();
	this.shadow.map = null;
	this.shadow.camera.updateProjectionMatrix();
};
