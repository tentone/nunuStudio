import {CopyShader} from "three/examples/jsm/shaders/CopyShader";
import {ShaderPass} from "../ShaderPass.js";

/**
 * Copy pass can be used to copy the actual content on the composer to the screen.
 *
 * @class CopyPass
 * @module Postprocessing
 */
class CopyPass extends ShaderPass
{
constructor()
{
super(CopyShader);

this.type = "Copy";
}
}

export {CopyPass};
