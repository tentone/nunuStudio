"use strict";

/**
 * Colorify pass can be used to colorify the scene.
 * 
 * @class ColorifyPass
 * @module Postprocessing
 * @constructor
 */
function ColorifyPass()
{
	ShaderPass.call(this, THREE.ColorifyShader);

	this.type = "Colorify";

}

ColorifyPass.prototype = Object.create(ShaderPass.prototype);
