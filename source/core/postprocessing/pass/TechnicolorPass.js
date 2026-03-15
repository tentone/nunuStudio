import {TechnicolorShader} from "three/examples/jsm/shaders/TechnicolorShader";
import {ShaderPass} from "../ShaderPass.js";

/**
 * Simulate technicolor television colors.
 * 
 * @class TechnicolorPass
 * @module Postprocessing
 */
class TechnicolorPass extends ShaderPass
{
constructor()
{
super(TechnicolorShader);

this.type = "Technicolor";
}
}

export {TechnicolorPass};
