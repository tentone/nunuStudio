"use strict";

/**
 * A SpotLight emit light from a point in a specific direction in a cone volume.
 * 
 * SpotLight has a target that is always represented in words coordinates, and can be moved to change where the light is pointing at.
 * 
 * Based on THREE.SpotLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/SpotLight
 *
 * @param {Number} color Light color in hex RGB
 * @param {Number} intensity Light intensity
 * @param {Number} distance SpotLight maximum range
 * @param {Number} angle
 * @param {Number} exponent
 * @param {Number} decay
 * @class SpotLight
 * @extends {SpotLight}
 * @module Lights
 */
function SpotLight(hex, intensity, distance, angle, exponent, decay)
{
	THREE._SpotLight.call(this, hex, intensity, distance, angle, exponent, decay);

	this.name = "spotlight";
	
	this.castShadow = true;

	this.shadow.camera.near = 0.05;
	this.shadow.camera.far = 5000;
	this.shadow.mapSize.width = 512;
	this.shadow.mapSize.height = 512;
}

THREE._SpotLight = THREE.SpotLight;
THREE.SpotLight = SpotLight;

SpotLight.prototype = Object.create(THREE._SpotLight.prototype);

/**
 * SpotLight looks to the target object coordinates.
 * 
 * The target object should always be at the scene root.
 *
 * @method setTarget
 * @param {Object3D} target Target object.
 */
SpotLight.prototype.setTarget = function(target)
{
	this.target = target;
}

/**
 * Update light shadow map atributtes at runtime.
 * 
 * @method updateShadowMap
 */
SpotLight.prototype.updateShadowMap = function()
{
	this.shadow.map.dispose();
	this.shadow.map = null;
	this.shadow.camera.updateProjectionMatrix();
};

/**
 * Serialize SpotLight data to JSON.
 *
 * @method toJSON
 * @param {Object} meta Meta.
 */
SpotLight.prototype.toJSON = function(meta)
{
	var data = THREE.Light.prototype.toJSON.call(this, meta);

	data.object.target = this.target.uuid;

	return data;
};
