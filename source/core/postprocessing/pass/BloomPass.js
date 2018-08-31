"use strict";

/**
 * Simple bloom effect pass.
 *
 * @class BloomPass
 * @author alteredq / http://alteredqualia.com/
 * @module Postprocessing
 * @param {Number} strength  Bloom effect strength.
 * @param {Number} kernelSize Bloom kernel size.
 * @param {Number} sigma Sigma.
 * @param {Number} resolution Bloom buffer resolution.
 */
function BloomPass(strength, kernelSize, sigma, resolution)
{
	Pass.call(this);

	if(THREE.ConvolutionShader === undefined)
	{
		console.error("BloomPass relies on THREE.ConvolutionShader");
	}
	if(THREE.CopyShader === undefined)
	{
		console.error("BloomPass relies on THREE.CopyShader");
	}

	this.type = "Bloom";
	this.needsSwap = false;

	strength = (strength !== undefined) ? strength : 1;
	kernelSize = (kernelSize !== undefined) ? kernelSize : 25;
	sigma = (sigma !== undefined) ? sigma : 4.0;
	resolution = (resolution !== undefined) ? resolution : 256;

	//Render targets
	var pars = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat};
	this.renderTargetX = new THREE.WebGLRenderTarget(resolution, resolution, pars);
	this.renderTargetX.texture.name = "BloomPass.x";
	this.renderTargetY = new THREE.WebGLRenderTarget(resolution, resolution, pars);
	this.renderTargetY.texture.name = "BloomPass.y";

	//Copy material
	this.copyUniforms = THREE.UniformsUtils.clone(THREE.CopyShader.uniforms);
	this.copyUniforms["opacity"].value = strength;
	this.materialCopy = new THREE.ShaderMaterial(
	{
		uniforms: this.copyUniforms,
		vertexShader: THREE.CopyShader.vertexShader,
		fragmentShader: THREE.CopyShader.fragmentShader,
		blending: THREE.AdditiveBlending,
		transparent: true
	});

	//Convolution material
	this.convolutionUniforms = THREE.UniformsUtils.clone(THREE.ConvolutionShader.uniforms);
	this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurX;
	this.convolutionUniforms["cKernel"].value = THREE.ConvolutionShader.buildKernel(sigma);
	this.materialConvolution = new THREE.ShaderMaterial(
	{
		uniforms: this.convolutionUniforms,
		vertexShader:  THREE.ConvolutionShader.vertexShader,
		fragmentShader: THREE.ConvolutionShader.fragmentShader,
		defines:
		{
			"KERNEL_SIZE_FLOAT": kernelSize.toFixed(1),
			"KERNEL_SIZE_INT": kernelSize.toFixed(0)
		}
	});

	//Scene
	this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	this.scene  = new THREE.Scene();
	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
	this.quad.frustumCulled = false;
	this.scene.add(this.quad);
}

BloomPass.blurX = new THREE.Vector2(0.001953125, 0.0);
BloomPass.blurY = new THREE.Vector2(0.0, 0.001953125);

BloomPass.prototype = Object.create(THREE.Pass.prototype);

BloomPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	if(maskActive)
	{
		renderer.context.disable(renderer.context.STENCIL_TEST);
	}

	//Render quad with blured scene into texture (convolution pass 1)
	this.quad.material = this.materialConvolution;
	this.convolutionUniforms["tDiffuse"].value = readBuffer.texture;
	this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurX;
	renderer.render(this.scene, this.camera, this.renderTargetX, true);

	//Render quad with blured scene into texture (convolution pass 2)
	this.convolutionUniforms["tDiffuse"].value = this.renderTargetX.texture;
	this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurY;
	renderer.render(this.scene, this.camera, this.renderTargetY, true);

	//Render original scene with superimposed blur to texture
	this.quad.material = this.materialCopy;
	this.copyUniforms["tDiffuse"].value = this.renderTargetY.texture;

	if(maskActive)
	{
		renderer.context.enable(renderer.context.STENCIL_TEST);
	}

	if(this.renderToScreen)
	{
		renderer.render(this.scene, this.camera);
	}
	else
	{
		renderer.render(this.scene, this.camera, writeBuffer, false);
	}
};

BloomPass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);

	data.strength = this.strength;
	data.kernelSize = this.kernelSize;
	data.sigma = this.sigma;
	data.resolution = this.resolution;

	return data;
};