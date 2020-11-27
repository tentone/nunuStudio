import {SobelOperatorShader} from "three/examples/jsm/shaders/SobelOperatorShader";
import {ShaderPass} from "../ShaderPass.js";

/**
 * Sobel pass is used to create a edge highlight effect with a sobel operator.
 *
 *
 * @class SobelPass
 * @module Postprocessing
 */
function SobelPass()
{
	ShaderPass.call(this, SobelOperatorShader);

	this.type = "Sobel";
}

SobelPass.prototype = Object.create(ShaderPass.prototype);

SobelPass.prototype.setSize = function(width, height)
{
	this.uniforms.resolution.value.set(width, height);
};

export {SobelPass};
