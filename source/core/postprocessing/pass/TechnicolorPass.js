"use strict";

/**
 * Colorify pass can be used to colorify the scene.
 * 
 * @class TechnicolorPass
 * @module Postprocessing
 * @constructor
 */
function TechnicolorPass()
{
	ShaderPass.call(this, THREE.TechnicolorShader);

	this.type = "Technicolor";
}

TechnicolorPass.prototype = Object.create(ShaderPass.prototype);
