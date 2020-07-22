import {HemisphereLight as THemisphereLight} from "three";

/**
 * A light source positioned directly above the scene, with color fading from the sky color to the ground color.
 * 
 * Based on HemisphereLight documentation for the object can be found at https:// threejs.org/docs/index.html#Reference/Lights/HemisphereLight
 * 
 * @param {number} skyColor Sky light color in hex RGB
 * @param {number} groundColor Ground light color in hex RGB
 * @param {number} intensity Light intensity
 * @class HemisphereLight
 * @extends {HemisphereLight}
 * @module Lights
 */
function HemisphereLight(skyColor, groundColor, intensity)
{
	THemisphereLight.call(this, skyColor, groundColor, intensity);

	this.name = "hemisphere";
}

HemisphereLight.prototype = Object.create(THemisphereLight.prototype);

// THREE.HemisphereLight = HemisphereLight;

export {HemisphereLight};
