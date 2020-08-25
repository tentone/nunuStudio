import {TechnicolorShader} from "three/examples/jsm/shaders/TechnicolorShader";
import {ShaderPass} from "../ShaderPass.js";

/**
 * Simulate technicolor television colors.
 * 
 * @class TechnicolorPass
 * @module Postprocessing
 */
function TechnicolorPass()
{
	ShaderPass.call(this, TechnicolorShader);

	this.type = "Technicolor";
}

TechnicolorPass.prototype = Object.create(ShaderPass.prototype);

export {TechnicolorPass};
