import {LightProbe as TLightProbe, WebGLRenderer, RGBAFormat, LinearFilter, Light} from "three";
import {LightProbeGenerator} from "three/examples/jsm/lights/LightProbeGenerator";

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
	TLightProbe.call(this, sh, intensity);

	this.type = "LightProbe";
	this.name = "probe";
}

LightProbe.prototype = Object.create(TLightProbe.prototype);

// THREE.LightProbe = LightProbe;

/**
 * Generate light probe data from cube camera render.
 *
 * @method generate
 */
LightProbe.prototype.generate = function()
{
	var scene = this.getScene();
	if (scene === null)
	{
		console.warn("nunuStudio: LightProbe cannot generate, no scene.", this);
		return;
	}

	var canvas = new OffscreenCanvas(256, 256);

	var renderer = new WebGLRenderer({canvas: canvas, alpha: true});
	
	var cubeCamera = new TCubeCamera(1, 1000, 256,
		{	
			format: RGBAFormat,
			magFilter: LinearFilter,
			minFilter: LinearFilter
		});
	cubeCamera.matrixAutoUpdate = false;
	cubeCamera.matrix.copy(this.matrix);
	cubeCamera.matrixWorld.copy(this.matrixWorld);

	// Since gamma is applied during rendering, the cubeCamera renderTarget texture encoding must be sRGBEncoding
	cubeCamera.renderTarget.texture.encoding = THREE.sRGBEncoding;
	cubeCamera.update(renderer, scene);

	// Calculate probe from cube camera result
	var result = LightProbeGenerator.fromCubeRenderTarget(renderer, cubeCamera.renderTarget);
	this.sh = result.sh;
};

LightProbe.prototype.toJSON = function(meta)
{
	var data = Light.prototype.toJSON.call(this, meta);

	data.object.sh = this.sh.toArray();

	return data;
};

export {LightProbe};
