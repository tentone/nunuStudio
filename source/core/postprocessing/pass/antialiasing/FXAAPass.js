import {ShaderPass} from "../../ShaderPass.js";
import {Pass} from "../../Pass.js";
import {FXAAShader} from "three";

/**
 * Fast approximate anti-aliasing (FXAA) is an anti-aliasing algorithm to smooth jagged edges on post procesing effects.
 * 
 * More information about FXAA available here:
 *  - https:// developer.download.nvidia.com/assets/gamedev/files/sdk/11/FXAA_WhitePaper.pdf
 * 
 * @class FXAAPass
 * @module Postprocessing
 */
function FXAAPass()
{
	ShaderPass.call(this, FXAAShader);

	this.type = "FXAA";
}

FXAAPass.prototype = Object.create(ShaderPass.prototype);

FXAAPass.prototype.setSize = function(width, height)
{
	this.uniforms["resolution"].value.set(1.0 / width, 1.0 / height);
};
export {FXAAPass};