import {WebGLRenderTarget, UniformsUtils, ShaderMaterial, Vector2, Vector3, AdditiveBlending, MeshBasicMaterial, Color} from "three";
import {LuminosityHighPassShader} from "three/examples/jsm/shaders/LuminosityHighPassShader";
import {CopyShader} from "three/examples/jsm/shaders/CopyShader";
import {Pass} from "../Pass.js";

/**
 * Unreal engine like bloom effect pass.
 *
 * More information available here
 *  - https:// docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 *
 * @author spidersharma / http:// eduperiment.com/
 * @class UnrealBloomPass
 * @module Postprocessing
 * @param {number} strength  Bloom effect strength.
 * @param {number} radius Bloom effect radius.
 * @param {number} threshold White point threshold.
 */
function UnrealBloomPass(strength, radius, threshold)
{
	Pass.call(this);

	this.type = "UnrealBloom";

	// Render targets for passes
	this.renderTargetsHorizontal = [];
	this.renderTargetsVertical = [];
	this.nMips = 5;

	for (var i = 0; i < this.nMips; i++)
	{
		var renderTarget = new WebGLRenderTarget(0, 0, Pass.RGBALinear);
		renderTarget.texture.generateMipmaps = false;
		this.renderTargetsHorizontal.push(renderTarget);

		var renderTarget = new WebGLRenderTarget(0, 0, Pass.RGBALinear);
		renderTarget.texture.generateMipmaps = false;
		this.renderTargetsVertical.push(renderTarget);
	}

	// Render target for final pass
	this.renderTargetBright = new WebGLRenderTarget(0, 0, Pass.RGBALinear);
	this.renderTargetBright.texture.generateMipmaps = false;

	// Luminosity high pass material
	var highPassShader = LuminosityHighPassShader;
	this.highPassUniforms = UniformsUtils.clone(highPassShader.uniforms);
	this.materialHighPassFilter = new ShaderMaterial(
		{
			uniforms: this.highPassUniforms,
			vertexShader: highPassShader.vertexShader,
			fragmentShader: highPassShader.fragmentShader,
			defines: {}
		});

	// Gaussian Blur material
	this.separableBlurMaterials = [];
	var kernelSizeArray = [3, 5, 7, 9, 11];
	for (var i = 0; i < this.nMips; i++)
	{
		this.separableBlurMaterials.push(UnrealBloomPass.getSeperableBlurMaterial(kernelSizeArray[i]));
		this.separableBlurMaterials[i].uniforms["texSize"].value = new Vector2(0, 0);
	}

	// Composite material
	this.compositeMaterial = UnrealBloomPass.getCompositeMaterial(this.nMips);
	this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
	this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
	this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
	this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
	this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;

	// Configuration parameters
	this.highPassUniforms["luminosityThreshold"].value = threshold !== undefined ? threshold : 0.7;
	this.highPassUniforms["smoothWidth"].value = 0.01;
	this.compositeMaterial.uniforms["bloomStrength"].value = strength !== undefined ? strength : 0.8;
	this.compositeMaterial.uniforms["bloomRadius"].value = radius !== undefined ? radius : 0.3;
	this.compositeMaterial.uniforms["bloomFactors"].value = [1.0, 0.8, 0.6, 0.4, 0.2];
	this.compositeMaterial.uniforms["bloomTintColors"].value = [new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1), new Vector3(1, 1, 1)];
	this.compositeMaterial.needsUpdate = true;

	// Copy material
	this.copyUniforms = UniformsUtils.clone(CopyShader.uniforms);
	this.copyUniforms["opacity"].value = 1.0;
	this.materialCopy = new ShaderMaterial(
		{
			uniforms: this.copyUniforms,
			vertexShader: CopyShader.vertexShader,
			fragmentShader: CopyShader.fragmentShader,
			blending: AdditiveBlending,
			depthTest: false,
			depthWrite: false,
			transparent: true
		});

	// Quad scene
	this.createQuadScene();
	this.basic = new MeshBasicMaterial();

	// Setters and getters for uniforms
	Object.defineProperties(this,
		{
		/**
		 * Scales the color of the whole bloom effect.
		 *
		 * @property strength
		 * @type {number}
		 */
			strength:
		{
			get: function() {return this.compositeMaterial.uniforms["bloomStrength"].value;},
			set: function(value) {this.compositeMaterial.uniforms["bloomStrength"].value = value;}
		},

			/**
			 * Bloom effect radius.
			 *
			 * @property radius
			 * @type {number}
			 */
			radius:
		{
			get: function() {return this.compositeMaterial.uniforms["bloomRadius"].value;},
			set: function(value) {this.compositeMaterial.uniforms["bloomRadius"].value = value;}
		},

			/**
			 * Defines how many luminance units a color needs to have to affect bloom. In addition to the threshold, there is a linear part (one unit wide) where the color only partly affects the bloom.
			 *
			 * To have all scene colors contributing to the bloom, a volume of -1 needs to be used.
			 *
			 * @property threshold
			 * @type {number}
			 */
			threshold:
		{
			get: function() {return this.highPassUniforms["luminosityThreshold"].value;},
			set: function(value) {this.highPassUniforms["luminosityThreshold"].value;}
		},

			/**
			 * Smooth factor.
			 *
			 * @property smooth
			 * @type {number}
			 */
			smooth:
		{
			get: function() {return this.highPassUniforms["smoothWidth"].value;},
			set: function(value) {this.highPassUniforms["smoothWidth"].value;}
		},

			/**
			 * The size in percent of the screen width. Is clamped by some number. If you need a larger number, use the next lower resolution blur instead (higher number).
			 *
			 * @property bloomFactors
			 * @type {Array}
			 */
			bloomFactors:
		{
			get: function() {return this.compositeMaterial.uniforms["bloomFactors"].value;},
			set: function(value) {this.compositeMaterial.uniforms["bloomFactors"].value;}
		},

			/**
			 * Modifies the brightness and color of each bloom. Using a black color will not make this pass faster but that can be done.
			 *
			 * @property bloomTintColors
			 * @type {Array}
			 */
			bloomTintColors:
		{
			get: function() {return this.compositeMaterial.uniforms["bloomTintColors"].value;},
			set: function(value) {this.compositeMaterial.uniforms["bloomTintColors"].value = value;}
		}
		});
}

UnrealBloomPass.prototype = Object.create(Pass.prototype);

UnrealBloomPass.BlurDirectionX = new Vector2(1.0, 0.0);
UnrealBloomPass.BlurDirectionY = new Vector2(0.0, 1.0);

UnrealBloomPass.prototype.dispose = function()
{
	for (var i = 0; i < this.renderTargetsHorizontal.length; i++)
	{
		this.renderTargetsHorizontal[i].dispose();
	}
	for (var i = 0; i < this.renderTargetsVertical.length; i++)
	{
		this.renderTargetsVertical[i].dispose();
	}
	this.renderTargetBright.dispose();
};

UnrealBloomPass.prototype.setSize = function(width, height)
{
	var resx = Math.round(width / 2);
	var resy = Math.round(height / 2);

	this.renderTargetBright.setSize(resx, resy);

	for (var i = 0; i < this.nMips; i++)
	{
		this.renderTargetsHorizontal[i].setSize(resx, resy);
		this.renderTargetsVertical[i].setSize(resx, resy);
		this.separableBlurMaterials[i].uniforms["texSize"].value.set(resx, resy);

		resx = Math.round(resx / 2);
		resy = Math.round(resy / 2);
	}
};

UnrealBloomPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	renderer.autoClear = false;
	renderer.setClearColor(new Color(0, 0, 0), 0);

	if (maskActive)
	{
		renderer.context.disable(renderer.context.STENCIL_TEST);
	}

	// Clear screen
	if (this.renderToScreen)
	{
		this.quad.material = this.basic;
		this.basic.map = readBuffer.texture;

		renderer.setRenderTarget(null);
		renderer.clear();
		renderer.render(this.scene, this.camera);
	}

	// Extract Bright Areas
	this.highPassUniforms["tDiffuse"].value = readBuffer.texture;
	this.quad.material = this.materialHighPassFilter;
	renderer.setRenderTarget(this.renderTargetBright);
	renderer.clear();
	renderer.render(this.scene, this.camera);

	// Blur All the mips progressively
	var inputRenderTarget = this.renderTargetBright;
	for (var i = 0; i < this.nMips; i++)
	{
		this.quad.material = this.separableBlurMaterials[i];

		this.separableBlurMaterials[i].uniforms["colorTexture"].value = inputRenderTarget.texture;
		this.separableBlurMaterials[i].uniforms["direction"].value = UnrealBloomPass.BlurDirectionX;

		renderer.setRenderTarget(this.renderTargetsHorizontal[i]);
		renderer.clear();
		renderer.render(this.scene, this.camera);

		this.separableBlurMaterials[i].uniforms["colorTexture"].value = this.renderTargetsHorizontal[i].texture;
		this.separableBlurMaterials[i].uniforms["direction"].value = UnrealBloomPass.BlurDirectionY;

		renderer.setRenderTarget(this.renderTargetsVertical[i]);
		renderer.clear();
		renderer.render(this.scene, this.camera);

		inputRenderTarget = this.renderTargetsVertical[i];
	}

	// Composite All the mips
	this.quad.material = this.compositeMaterial;
	renderer.setRenderTarget(this.renderTargetsHorizontal[0]);
	renderer.render(this.scene, this.camera);

	// Blend it additively over the input texture
	this.quad.material = this.materialCopy;
	this.copyUniforms["tDiffuse"].value = this.renderTargetsHorizontal[0].texture;

	if (maskActive)
	{
		renderer.context.enable(renderer.context.STENCIL_TEST);
	}

	renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);
	renderer.render(this.scene, this.camera);
};

/**
 * Serialize this effect composer to JSON.
 *
 * @method toJSON
 */
UnrealBloomPass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);

	data.strength = this.strength;
	data.radius = this.radius;
	data.threshold = this.threshold;
	data.bloomFactors = this.bloomFactors;

	data.bloomTintColors = [];
	for (var i = 0; i < this.bloomTintColors.length; i++)
	{
		data.bloomTintColors.push(this.bloomTintColors[i].toArray());
	}

	return data;
};

UnrealBloomPass.getSeperableBlurMaterial = function(kernelRadius)
{
	return new ShaderMaterial(
		{
			defines:
		{
			KERNEL_RADIUS: kernelRadius,
			SIGMA: kernelRadius
		},
			uniforms:
		{
			colorTexture: {value: null},
			texSize: {value: new Vector2(0.5, 0.5)},
			direction: {value: new Vector2(0.5, 0.5)}
		},
			vertexShader: "\n\
			varying vec2 vUv;\n\
			void main()\n\
			{\n\
				vUv = uv;\n\
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\
			}",
			fragmentShader: "\n\
			#include <common>\n\
			varying vec2 vUv;\n\
			uniform sampler2D colorTexture;\n\
			uniform vec2 texSize;\n\
			uniform vec2 direction;\n\
			\n\
			float gaussianPdf(in float x, in float sigma)\n\
			{\n\
				return 0.39894 * exp(-0.5 * x * x / (sigma * sigma)) / sigma;\n\
			}\n\
			\n\
			void main()\n\
			{\n\
				vec2 invSize = 1.0 / texSize;\n\
				float fSigma = float(SIGMA);\n\
				float weightSum = gaussianPdf(0.0, fSigma);\n\
				vec3 diffuseSum = texture2D(colorTexture, vUv).rgb * weightSum;\n\
				for(int i = 1; i < KERNEL_RADIUS; i++)\n\
				{\n\
					float x = float(i);\n\
					float w = gaussianPdf(x, fSigma);\n\
					vec2 uvOffset = direction * invSize * x;\n\
					vec3 sample1 = texture2D(colorTexture, vUv + uvOffset).rgb;\n\
					vec3 sample2 = texture2D(colorTexture, vUv - uvOffset).rgb;\n\
					diffuseSum += (sample1 + sample2) * w;\n\
					weightSum += 2.0 * w;\n\
				}\n\
				gl_FragColor = vec4(diffuseSum/weightSum, 1.0);\n\
			}"
		});
};

UnrealBloomPass.getCompositeMaterial = function(nMips)
{
	return new ShaderMaterial(
		{
			defines:
		{NUM_MIPS: nMips},
			uniforms:
		{
			blurTexture1: {value: null},
			blurTexture2: {value: null},
			blurTexture3: {value: null},
			blurTexture4: {value: null},
			blurTexture5: {value: null},
			dirtTexture: {value: null},
			bloomStrength: {value: 1.0},
			bloomFactors: {value: null},
			bloomTintColors: {value: null},
			bloomRadius: {value: 0.0}
		},
			vertexShader: "\n\
			varying vec2 vUv;\n\
			void main()\n\
			{\n\
				vUv = uv;\n\
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n\
			}",
			fragmentShader: "\n\
			varying vec2 vUv;\n\
			uniform sampler2D blurTexture1;\n\
			uniform sampler2D blurTexture2;\n\
			uniform sampler2D blurTexture3;\n\
			uniform sampler2D blurTexture4;\n\
			uniform sampler2D blurTexture5;\n\
			uniform sampler2D dirtTexture;\n\
			uniform float bloomStrength;\n\
			uniform float bloomRadius;\n\
			uniform float bloomFactors[NUM_MIPS];\n\
			uniform vec3 bloomTintColors[NUM_MIPS];\n\
			\n\
			float lerpBloomFactor(const in float factor)\n\
			{\n\
				float mirrorFactor = 1.2 - factor;\n\
				return mix(factor, mirrorFactor, bloomRadius);\n\
			}\n\
			\n\
			void main()\n\
			{\n\
				gl_FragColor = bloomStrength * (lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) + \n\
												 lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) + \n\
												 lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) + \n\
												 lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) + \n\
												 lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv));\n\
			}"
		});
};

export {UnrealBloomPass};
