"use strict";

/**
 * Same as THREE.AmbientLight documentation for the object can be found at https://threejs.org/docs/index.html#Reference/Lights/AmbientLight
 * @param {Number} hex Light color in hex RGB
 * @class AmbientLight
 * @extends {THREE.AmbientLight}
 * @module Lights
 * @constructor
 */
function AmbientLight(hex)
{
	THREE.AmbientLight.call(this, hex);
	
	this.name = "ambient";

	this.matrixAutoUpdate = false;
}

AmbientLight.prototype = Object.create(THREE.AmbientLight.prototype);