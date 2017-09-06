"use strict";

/**
 * Sobel pass is used to create a edge highlight effect with a sobel operator.
 *  
 * @class SobelPass
 * @constructor
 * @module Postprocessing
 */
function SobelPass(center, angle, scale)
{
	if(THREE.SobelOperatorShader === undefined)
	{
		console.error("SobelPass relies on THREE.SobelOperatorShader");
	}
	if(THREE.LuminosityShader === undefined)
	{
		console.error("SobelPass relies on THREE.LuminosityShader");
	}

	ShaderPass.call(this, THREE.SobelOperatorShader);

	this.type = "Sobel";
};

SobelPass.prototype = Object.create(ShaderPass.prototype);

SobelPass.prototype.setSize = function(width, height)
{
	this.uniforms.resolution.value.set(width, height);
};
