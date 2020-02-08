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
 *
 * @method generate
 */
LightProbe.prototype.generate = function()
{
	var scene = this.getScene();
	if(scene === null)
	{
		console.warn("nunuStudio: LightProbe cannot generate, no scene.", this);
		return;
	}

	var canvas = new OffscreenCanvas(256, 256);

	var renderer = new THREE.WebGLRenderer({canvas: canvas, alpha: true});
	
	var cubeCamera = new THREE._CubeCamera(1, 1000, 256,
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

	// Calculate probe from cube camera result
	var result = LightProbeGenerator.fromCubeRenderTarget(renderer, cubeCamera.renderTarget);
	this.sh = result.sh;
};

LightProbe.prototype.toJSON = function(meta)
{
	var data = THREE.Light.prototype.toJSON.call(this, meta);

	data.object.sh = this.sh.toArray();

	return data;
};
