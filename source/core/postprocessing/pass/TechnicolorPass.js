import {ShaderPass} from "../../ShaderPass.js";
import {Pass} from "../../Pass.js";
import {TechnicolorShader} from "three";

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