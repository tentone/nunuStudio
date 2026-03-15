import {SobelOperatorShader} from "three/examples/jsm/shaders/SobelOperatorShader";
import {ShaderPass} from "../ShaderPass.js";

/**
 * Sobel pass is used to create a edge highlight effect with a sobel operator.
 *
 *
 * @class SobelPass
 * @module Postprocessing
 */
class SobelPass extends ShaderPass
{
constructor()
{
super(SobelOperatorShader);

this.type = "Sobel";
}

setSize(width, height)
{
this.uniforms.resolution.value.set(width, height);
}
}

export {SobelPass};
