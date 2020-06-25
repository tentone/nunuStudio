import {AmbientLight} from "three";


/**
 * Ambient lights are used to create base ilumanition for the scene.
 *
 * They are not influenced by position, scale or rotation.
 * 
 * Based on AmbientLight documentation for the object can be found at https:// threejs.org/docs/index.html#Reference/Lights/AmbientLight
 * 
 * @param {number} hex Light color in hex RGB
 * @class AmbientLight
 * @extends {AmbientLight}
 * @module Lights
 */
function AmbientLight(hex)
{
	THREE._AmbientLight.call(this, hex);
	
	this.name = "ambient";

	this.matrixAutoUpdate = false;
}

THREE._AmbientLight = AmbientLight;
AmbientLight = AmbientLight;

AmbientLight.prototype = Object.create(THREE._AmbientLight.prototype);
export {AmbientLight};