import {Sky} from "../../misc/Sky.js";
import {HemisphereLight} from "three";


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
	THREE._HemisphereLight.call(this, skyColor, groundColor, intensity);

	this.name = "hemisphere";
}

THREE._HemisphereLight = HemisphereLight;
HemisphereLight = HemisphereLight;

HemisphereLight.prototype = Object.create(THREE._HemisphereLight.prototype);
export {HemisphereLight};