import {ShaderPass} from "../ShaderPass.js";
import {Pass} from "../Pass.js";
import {SobelOperatorShader, LuminosityShader} from "three";

/**
 * Sobel pass is used to create a edge highlight effect with a sobel operator.
 *  
 * @class SobelPass
 * @module Postprocessing
 */
function SobelPass(center, angle, scale)
{
	if(SobelOperatorShader === undefined)
	{
		console.error("SobelPass relies on SobelOperatorShader");
	}
	if(LuminosityShader === undefined)
	{
		console.error("SobelPass relies on LuminosityShader");
	}

	ShaderPass.call(this, SobelOperatorShader);

	this.type = "Sobel";
};

SobelPass.prototype = Object.create(ShaderPass.prototype);

SobelPass.prototype.setSize = function(width, height)
{
	this.uniforms.resolution.value.set(width, height);
};

export {SobelPass};