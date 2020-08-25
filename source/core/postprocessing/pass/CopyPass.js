import {CopyShader} from "three/examples/jsm/shaders/CopyShader";
import {ShaderPass} from "../ShaderPass.js";

/**
 * Copy pass can be used to copy the actual content on the composer to the screen.
 *
 * @class CopyPass
 * @module Postprocessing
 */
function CopyPass()
{
	ShaderPass.call(this, CopyShader);

	this.type = "Copy";
}

CopyPass.prototype = Object.create(ShaderPass.prototype);

export {CopyPass};
