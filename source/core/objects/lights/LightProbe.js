"use strict";

/**
 * A LightProbe is a source of indirect-diffuse light.
 *
 * @param {number} sh Light color in hex RGB
 * @param {number} intensity Light intensity
 * @class LightProbe
 * @extends {LightProbe}
 * @module Lights
 */
function LightProbe(sh, intensity)
{
	THREE._LightProbe.call(this, sh, intensity);

	this.type = "LightProbe";
	this.name = "probe";
}

THREE._LightProbe = THREE.LightProbe;
THREE.LightProbe = LightProbe;

LightProbe.prototype = Object.create(THREE._LightProbe.prototype);

/**
 * Generate light probe data from cube camera render.
 */
LightProbe.prototype.generateFromCubeCamera = function(scene, renderer)
{
	var cubeCamera = new THREE.CubeCamera(1, 1000, 256,
	{	
		format: THREE.RGBAFormat,
		magFilter: THREE.LinearFilter,
		minFilter: THREE.LinearFilter
	});
	cubeCamera.matrixAutoUpdate = false;
	cubeCamera.matrix.copy(this.matrix);
	cubeCamera.matrixWorld.copy(this.matrixWorld);

	//Since gamma is applied during rendering, the cubeCamera renderTarget texture encoding must be sRGBEncoding
	cubeCamera.renderTarget.texture.encoding = THREE.sRGBEncoding;
	cubeCamera.update(renderer, scene);

	this.copy(LightProbeGenerator.fromCubeRenderTarget(renderer, cubeCamera.renderTarget));
};

LightProbe.prototype.toJSON = function(meta)
{
	var data = THREE.Light.prototype.toJSON.call(this, meta);

	data.sh = this.sh.toArray();

	return data;
};
