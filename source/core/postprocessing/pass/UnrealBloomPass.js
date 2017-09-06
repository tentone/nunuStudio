"use strict";

/**
 * Unreal engine like bloom effect pass.
 *
 * More information available here
 *  - https://docs.unrealengine.com/latest/INT/Engine/Rendering/PostProcessEffects/Bloom/
 *
 * @author spidersharma / http://eduperiment.com/
 * @class UnrealBloomPass
 * @module Postprocessing
 * @constructor
 * @param {Number} strength  Bloom effect strength.
 * @param {Number} radius Bloom effect radius.
 * @param {Number} threshold White point threshold.
 */
/**
 * Scales the color of the whole bloom effect.
 *
 * @property strength
 * @type {Number}
 */
/**
 * Bloom effect radius.
 *
 * @property radius
 * @type {Number}
 */
/**
 * Defines how many luminance units a color needs to have to affect bloom. In addition to the threshold, there is a linear part (one unit wide) where the color only partly affects the bloom.
 * 
 * To have all scene colors contributing to the bloom, a volume of -1 needs to be used.
 *
 * @property threshold
 * @type {Number}
 */
/**
 * Smooth factor.
 *
 * @property smooth
 * @type {Number}
 */
/**
 * The size in percent of the screen width. Is clamped by some number. If you need a larger number, use the next lower resolution blur instead (higher number).
 *
 * @property bloomFactors
 * @type {Array}
 */
/**
 * Modifies the brightness and color of each bloom. Using a black color will not make this pass faster but that can be done.
 *
 * @property bloomTintColors
 * @type {Array}
 */
function UnrealBloomPass(strength, radius, threshold)
{
	if(THREE.LuminosityHighPassShader === undefined)
	{
		console.error("UnrealBloomPass relies on THREE.LuminosityHighPassShader");
	}
	if(THREE.CopyShader === undefined)
	{
		console.error("UnrealBloomPass relies on THREE.CopyShader");
	}

	Pass.call(this);
	
	this.type = "UnrealBloom";
	this.enabled = true;
	this.needsSwap = false;
	this.renderToScreen = false;

	//Render targets
	var parameters =
	{
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat
	};
	
	//Render targets for passes
	this.renderTargetsHorizontal = [];
	this.renderTargetsVertical = [];
	this.nMips = 5;

	for(var i = 0; i < this.nMips; i++)
	{
		var renderTarget = new THREE.WebGLRenderTarget(0, 0, parameters);
		renderTarget.texture.generateMipmaps = false;
		this.renderTargetsHorizontal.push(renderTarget);

		var renderTarget = new THREE.WebGLRenderTarget(0, 0, parameters);
		renderTarget.texture.generateMipmaps = false;
		this.renderTargetsVertical.push(renderTarget);
	}

	//Render target for final pass
	this.renderTargetBright = new THREE.WebGLRenderTarget(0, 0, parameters);
	this.renderTargetBright.texture.generateMipmaps = false;

	//Luminosity high pass material
	var highPassShader = THREE.LuminosityHighPassShader;
	this.highPassUniforms = THREE.UniformsUtils.clone(highPassShader.uniforms);
	this.highPassUniforms["luminosityThreshold"].value = (threshold !== undefined) ? threshold : 0.7;
	this.highPassUniforms["smoothWidth"].value = 0.01;
	this.materialHighPassFilter = new THREE.ShaderMaterial(
	{
		uniforms: this.highPassUniforms,
		vertexShader: highPassShader.vertexShader,
		fragmentShader: highPassShader.fragmentShader,
		defines: {}
	});

	//Gaussian Blur material
	this.separableBlurMaterials = [];
	var kernelSizeArray = [3, 5, 7, 9, 11];
	for(var i = 0; i < this.nMips; i++)
	{
		this.separableBlurMaterials.push(UnrealBloomPass.getSeperableBlurMaterial(kernelSizeArray[i]));
		this.separableBlurMaterials[i].uniforms["texSize"].value = new THREE.Vector2(0, 0);
	}

	//Composite material
	this.compositeMaterial = UnrealBloomPass.getCompositeMaterial(this.nMips);
	this.compositeMaterial.uniforms["blurTexture1"].value = this.renderTargetsVertical[0].texture;
	this.compositeMaterial.uniforms["blurTexture2"].value = this.renderTargetsVertical[1].texture;
	this.compositeMaterial.uniforms["blurTexture3"].value = this.renderTargetsVertical[2].texture;
	this.compositeMaterial.uniforms["blurTexture4"].value = this.renderTargetsVertical[3].texture;
	this.compositeMaterial.uniforms["blurTexture5"].value = this.renderTargetsVertical[4].texture;
	this.compositeMaterial.uniforms["bloomStrength"].value = (strength !== undefined) ? strength : 1;
	this.compositeMaterial.uniforms["bloomRadius"].value = (radius !== undefined) ? radius : 0.1;
	this.compositeMaterial.uniforms["bloomFactors"].value = [1.0, 0.8, 0.6, 0.4, 0.2];
	this.compositeMaterial.uniforms["bloomTintColors"].value = [new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1), new THREE.Vector3(1, 1, 1)];
	this.compositeMaterial.needsUpdate = true;

	//Copy material
	this.copyUniforms = THREE.UniformsUtils.clone(THREE.CopyShader.uniforms);
	this.copyUniforms["opacity"].value = 1.0;
	this.materialCopy = new THREE.ShaderMaterial(
	{
		uniforms: this.copyUniforms,
		vertexShader: THREE.CopyShader.vertexShader,
		fragmentShader: THREE.CopyShader.fragmentShader,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		depthWrite: false,
		transparent: true
	});

	//Renderer properties backup
	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;
	this.oldAutoClear = false;

	//Quad scene
	this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	this.scene = new THREE.Scene();
	this.basic = new THREE.MeshBasicMaterial();
	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
	this.quad.frustumCulled = false;
	this.scene.add(this.quad);

	//Setters and getters for uniforms
	var self = this;
	Object.defineProperties(this,
	{
		strength:
		{
			get: function() {return this.compositeMaterial.uniforms["bloomStrength"].value;},
			set: function(value) {this.compositeMaterial.uniforms["bloomStrength"].value = value;}
		},

		radius:
		{
			get: function() {return this.compositeMaterial.uniforms["bloomRadius"].value;},
			set: function(value) {this.compositeMaterial.uniforms["bloomRadius"].value = value;}
		},

		threshold:
		{
			get: function() {return this.highPassUniforms["luminosityThreshold"].value;},
			set: function(value) {this.highPassUniforms["luminosityThreshold"].value;}
		},

		smooth:
		{
			get: function() {return this.highPassUniforms["smoothWidth"].value;},
			set: function(value) {this.highPassUniforms["smoothWidth"].value;}
		},

		bloomFactors:
		{
			get: function() {return this.compositeMaterial.uniforms["bloomFactors"].value;},
			set: function(value) {this.compositeMaterial.uniforms["bloomFactors"].value;}
		},

		bloomTintColors:
		{
			get: function() {return this.compositeMaterial.uniforms["bloomTintColors"].value;},
			set: function(value) {this.compositeMaterial.uniforms["bloomTintColors"].value = value;}
		}
	});
}

UnrealBloomPass.prototype = Object.create(Pass.prototype);

UnrealBloomPass.BlurDirectionX = new THREE.Vector2(1.0, 0.0);
UnrealBloomPass.BlurDirectionY = new THREE.Vector2(0.0, 1.0);

UnrealBloomPass.prototype.dispose = function()
{
	for(var i = 0; i < this.renderTargetsHorizontal.length; i++)
	{
		this.renderTargetsHorizontal[i].dispose();
	}
	for(var i = 0; i < this.renderTargetsVertical.length; i++)
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
	
	for(var i = 0; i < this.nMips; i++)
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
	//Backup renderer settings
	this.oldClearColor.copy(renderer.getClearColor());
	this.oldClearAlpha = renderer.getClearAlpha();
	this.oldAutoClear = renderer.autoClear;

	//Configure renderer
	renderer.autoClear = false;
	renderer.setClearColor(new THREE.Color(0, 0, 0), 0);
	
	if(maskActive)
	{
		renderer.context.disable(renderer.context.STENCIL_TEST);
	}

	//Render input to screen
	if(this.renderToScreen)
	{
		this.quad.material = this.basic;
		this.basic.map = readBuffer.texture;
		renderer.render(this.scene, this.camera, undefined, true);
	}

	//Extract Bright Areas
	this.highPassUniforms["tDiffuse"].value = readBuffer.texture;
	this.quad.material = this.materialHighPassFilter;
	renderer.render(this.scene, this.camera, this.renderTargetBright, true);

	//Blur All the mips progressively
	var inputRenderTarget = this.renderTargetBright;
	for(var i = 0; i < this.nMips; i++)
	{
		this.quad.material = this.separableBlurMaterials[i];

		this.separableBlurMaterials[i].uniforms["colorTexture"].value = inputRenderTarget.texture;
		this.separableBlurMaterials[i].uniforms["direction"].value = UnrealBloomPass.BlurDirectionX;
		renderer.render(this.scene, this.camera, this.renderTargetsHorizontal[i], true);

		this.separableBlurMaterials[i].uniforms["colorTexture"].value = this.renderTargetsHorizontal[i].texture;
		this.separableBlurMaterials[i].uniforms["direction"].value = UnrealBloomPass.BlurDirectionY;
		renderer.render(this.scene, this.camera, this.renderTargetsVertical[i], true);

		inputRenderTarget = this.renderTargetsVertical[i];
	}

	//Composite All the mips
	this.quad.material = this.compositeMaterial;
	renderer.render(this.scene, this.camera, this.renderTargetsHorizontal[0], true);

	//Blend it additively over the input texture
	this.quad.material = this.materialCopy;
	this.copyUniforms["tDiffuse"].value = this.renderTargetsHorizontal[0].texture;
	
	if(maskActive)
	{
		renderer.context.enable(renderer.context.STENCIL_TEST);
	}

	//Restore renderer settings
	if(this.renderToScreen)
	{
		renderer.render(this.scene, this.camera, undefined, false);
	}
	else
	{
		renderer.render(this.scene, this.camera, readBuffer, false);
	}

	//Restore renderer settings
	renderer.setClearColor(this.oldClearColor, this.oldClearAlpha);
	renderer.autoClear = this.oldAutoClear;
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
	for(var i = 0; i < this.bloomTintColors.length; i++)
	{
		data.bloomTintColors.push(this.bloomTintColors[i].toArray());
	}

	return data;
};

UnrealBloomPass.getSeperableBlurMaterial = function(kernelRadius)
{
	return new THREE.ShaderMaterial(
	{
		defines:
		{
			"KERNEL_RADIUS": kernelRadius,
			"SIGMA": kernelRadius
		},
		uniforms:
		{
			"colorTexture":
			{
				value: null
			},
			"texSize":
			{
				value: new THREE.Vector2(0.5, 0.5)
			},
			"direction":
			{
				value: new THREE.Vector2(0.5, 0.5)
			}
		},
		vertexShader: "varying vec2 vUv;\n\
			void main() {\n\
				vUv = uv;\n\
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
			}",
		fragmentShader: "#include <common>\
			varying vec2 vUv;\n\
			uniform sampler2D colorTexture;\n\
			uniform vec2 texSize;\
			uniform vec2 direction;\
			\
			float gaussianPdf(in float x, in float sigma) {\
				return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;\
			}\
			void main() {\n\
				vec2 invSize = 1.0 / texSize;\
				float fSigma = float(SIGMA);\
				float weightSum = gaussianPdf(0.0, fSigma);\
				vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;\
				for( int i = 1; i < KERNEL_RADIUS; i ++ ) {\
					float x = float(i);\
					float w = gaussianPdf(x, fSigma);\
					vec2 uvOffset = direction * invSize * x;\
					vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;\
					vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;\
					diffuseSum += (sample1 + sample2) * w;\
					weightSum += 2.0 * w;\
				}\
				gl_FragColor = vec4(diffuseSum/weightSum, 1.0);\n\
			}"
	});
};

UnrealBloomPass.getCompositeMaterial = function(nMips)
{
	return new THREE.ShaderMaterial(
	{
		defines:
		{
			"NUM_MIPS": nMips
		},
		uniforms:
		{
			"blurTexture1":
			{
				value: null
			},
			"blurTexture2":
			{
				value: null
			},
			"blurTexture3":
			{
				value: null
			},
			"blurTexture4":
			{
				value: null
			},
			"blurTexture5":
			{
				value: null
			},
			"dirtTexture":
			{
				value: null
			},
			"bloomStrength":
			{
				value: 1.0
			},
			"bloomFactors":
			{
				value: null
			},
			"bloomTintColors":
			{
				value: null
			},
			"bloomRadius":
			{
				value: 0.0
			}
		},
		vertexShader: "varying vec2 vUv;\n\
			void main() {\n\
				vUv = uv;\n\
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\
			}",
		fragmentShader: "varying vec2 vUv;\
			uniform sampler2D blurTexture1;\
			uniform sampler2D blurTexture2;\
			uniform sampler2D blurTexture3;\
			uniform sampler2D blurTexture4;\
			uniform sampler2D blurTexture5;\
			uniform sampler2D dirtTexture;\
			uniform float bloomStrength;\
			uniform float bloomRadius;\
			uniform float bloomFactors[NUM_MIPS];\
			uniform vec3 bloomTintColors[NUM_MIPS];\
			\
			float lerpBloomFactor(const in float factor) { \
				float mirrorFactor = 1.2 - factor;\
				return mix(factor, mirrorFactor, bloomRadius);\
			}\
			\
			void main() {\
				gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) + \
												 lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) + \
												 lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) + \
												 lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) + \
												 lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );\
			}"
	});
};
