import {Image} from "../../../resources/Image.js";
import {Pass} from "../../Pass.js";
import {Scene} from "../../../objects/Scene.js";
import {ConvolutionShader, CopyShader, WebGLRenderTarget, UniformsUtils, ShaderMaterial, AdditiveBlending, Vector2} from "three";

/**
 * Simple bloom effect pass.
 *
 * @class BloomPass
 * @author alteredq / http:// alteredqualia.com/
 * @module Postprocessing
 * @param {number} strength  Bloom effect strength.
 * @param {number} kernelSize Bloom kernel size.
 * @param {number} sigma Sigma.
 * @param {number} resolution Bloom buffer resolution.
 */
function BloomPass(strength, kernelSize, sigma, resolution)
{
	Pass.call(this);

	if(ConvolutionShader === undefined)
	{
		console.error("BloomPass relies on ConvolutionShader");
	}
	if(CopyShader === undefined)
	{
		console.error("BloomPass relies on CopyShader");
	}

	this.type = "Bloom";
	this.copyToScreen = true;

	this.createQuadScene();

	strength = (strength !== undefined) ? strength : 1;
	kernelSize = (kernelSize !== undefined) ? kernelSize : 25;
	sigma = (sigma !== undefined) ? sigma : 4.0;
	resolution = (resolution !== undefined) ? resolution : 256;

	// Render targets
	this.renderTargetX = new WebGLRenderTarget(resolution, resolution, Pass.RGBALinear);

	// Render targets
	this.renderTargetY = new WebGLRenderTarget(resolution, resolution, Pass.RGBALinear);

	// Copy material
	this.copyUniforms = UniformsUtils.clone(CopyShader.uniforms);
	this.copyUniforms["opacity"].value = strength;

	// Copy material
	this.materialCopy = new ShaderMaterial(
	{
		uniforms: this.copyUniforms,
		vertexShader: CopyShader.vertexShader,
		fragmentShader: CopyShader.fragmentShader,
		blending: AdditiveBlending,
		transparent: true
	});

	// Convolution material
	this.convolutionUniforms = UniformsUtils.clone(ConvolutionShader.uniforms);
	this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurX;
	this.convolutionUniforms["cKernel"].value = ConvolutionShader.buildKernel(sigma);
	this.materialConvolution = new ShaderMaterial(
	{
		uniforms: this.convolutionUniforms,
		vertexShader:  ConvolutionShader.vertexShader,
		fragmentShader: ConvolutionShader.fragmentShader,
		defines:
		{
			"KERNEL_SIZE_FLOAT": kernelSize.toFixed(1),
			"KERNEL_SIZE_INT": kernelSize.toFixed(0)
		}
	});
	
}

BloomPass.blurX = new Vector2(0.001953125, 0.0);
BloomPass.blurY = new Vector2(0.0, 0.001953125);

BloomPass.prototype = Object.create(Pass.prototype);

BloomPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	if(maskActive)
	{
		renderer.context.disable(renderer.context.STENCIL_TEST);
	}

	// Render quad with blured scene into texture (convolution pass 1)
	this.quad.material = this.materialConvolution;
	this.convolutionUniforms["tDiffuse"].value = readBuffer.texture;
	this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurX;
	renderer.setRenderTarget(this.renderTargetX);
	renderer.clear(true, true, true);
	renderer.render(this.scene, this.camera);

	// Render quad with blured scene into texture (convolution pass 2)
	this.convolutionUniforms["tDiffuse"].value = this.renderTargetX.texture;
	this.convolutionUniforms["uImageIncrement"].value = BloomPass.blurY;
	renderer.setRenderTarget(this.renderTargetY);
	renderer.clear(true, true, true);
	renderer.render(this.scene, this.camera);

	// Render original scene with superimposed blur to texture
	this.quad.material = this.materialCopy;
	this.copyUniforms["tDiffuse"].value = this.renderTargetY.texture;

	if(maskActive)
	{
		renderer.context.enable(renderer.context.STENCIL_TEST);
	}

	renderer.setRenderTarget(writeBuffer);
	renderer.render(this.scene, this.camera);
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
export {BloomPass};