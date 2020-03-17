"use strict";

/**
 * Screen space ambient occlusion (SSAO) pass is used to simulate ambient occlusion shadowing effect.
 *
 * Uses the normal-oriented hemisphere method produces a more realistic-looking than the basic Crysis method.
 *
 * Based on the article from http:// john-chapman-graphics.blogspot.com/2013/01/ssao-tutorial.html
 *
 * More information about SSAO here
 *  - http:// developer.download.nvidia.com/SDK/10.5/direct3d/Source/ScreenSpaceAO/doc/ScreenSpaceAO.pdf
 *
 * @class SSAONOHPass
 * @module Postprocessing
 */
function SSAONOHPass()
{
	if(THREE.SSAOShader === undefined)
	{
		console.warn("SSAONOHPass depends on THREE.SSAOShader");
	}

	Pass.call(this);

	this.type = "SSAONOH";
	
	this.kernel = [];
	this.noiseTexture = null;
	this.createQuadScene();

	/**
	 * Depth texture attached to the normal material
	 *
	 * @attribute depthTexture
	 * @type {THREE.DepthTexture}
	 */
	this.depthTexture = new THREE.DepthTexture();
	this.depthTexture.type = THREE.UnsignedShortType;
	this.depthTexture.minFilter = THREE.NearestFilter;
	this.depthTexture.maxFilter = THREE.NearestFilter;

	/**
	 * Normal rendering material.
	 *
	 * @attribute normalMaterial
	 * @type {THREE.MeshNormalMaterial}
	 */
	this.normalMaterial = new THREE.MeshNormalMaterial();
	this.normalMaterial.blending = THREE.NoBlending;

	// Normal render target
	this.normalRenderTarget = new THREE.WebGLRenderTarget(1, 1,
	{
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBAFormat,
		depthTexture: this.depthTexture,
		depthBuffer: true
	});

	// SSAO render target
	this.ssaoRenderTarget = new THREE.WebGLRenderTarget(1, 1, Pass.RGBALinear);

	// Blur render target
	this.blurRenderTarget = new THREE.WebGLRenderTarget(1, 1, Pass.RGBALinear);

	/**
	 * Blur pass render material.
	 *
	 * @attribute blurMaterial
	 * @type {THREE.ShaderMaterial}
	 */
	this.blurMaterial = new THREE.ShaderMaterial(
	{
		defines: Object.assign({}, THREE.SSAOBlurShader.defines),
		uniforms: THREE.UniformsUtils.clone(THREE.SSAOBlurShader.uniforms),
		vertexShader: THREE.SSAOBlurShader.vertexShader,
		fragmentShader: THREE.SSAOBlurShader.fragmentShader
	});
	this.blurMaterial.uniforms["tDiffuse"].value = this.ssaoRenderTarget.texture;

	/**
	 * Shader material for the SSAO render pass.
	 *
	 * @attribute ssaoMaterial
	 * @type {THREE.ShaderMaterial}
	 */
	this.ssaoMaterial = new THREE.ShaderMaterial(
	{
		defines: Object.assign({}, THREE.SSAOShader.defines),
		uniforms: THREE.UniformsUtils.clone(THREE.SSAOShader.uniforms),
		vertexShader: THREE.SSAOShader.vertexShader,
		fragmentShader: THREE.SSAOShader.fragmentShader,
		blending: THREE.NoBlending
	});
	this.ssaoMaterial.uniforms["tNormal"].value = this.normalRenderTarget.texture;
	
	/**
	 * Material used to copy data between buffers.
	 *
	 * @attribute copyMaterial
	 * @type {THREE.ShaderMaterial}
	 */
	this.copyMaterial = new THREE.ShaderMaterial(
	{
		uniforms: THREE.UniformsUtils.clone(THREE.CopyShader.uniforms),
		vertexShader: THREE.CopyShader.vertexShader,
		fragmentShader: THREE.CopyShader.fragmentShader,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		blendSrc: THREE.DstColorFactor,
		blendDst: THREE.ZeroFactor,
		blendEquation: THREE.AddEquation,
		blendSrcAlpha: THREE.DstAlphaFactor,
		blendDstAlpha: THREE.ZeroFactor,
		blendEquationAlpha: THREE.AddEquation
	});

	this._kernelSize = 0;
	
	var self = this;

	Object.defineProperties(this,
	{
		/**
		 * Kernel radius used for the SSAO effect.
		 *
		 * @property kernelRadius
		 * @type {boolean}
		 */
		kernelRadius:
		{
			get: function(){return self.ssaoMaterial.uniforms["kernelRadius"].value;},
			set: function(value){self.ssaoMaterial.uniforms["kernelRadius"].value = value;}
		},

		/**
		 * Minimum camera distance considered for the SSAO effect.
		 *
		 * @property minDistance
		 * @type {number}
		 */
		minDistance:
		{
			get: function(){return self.ssaoMaterial.uniforms["minDistance"].value;},
			set: function(value){self.ssaoMaterial.uniforms["minDistance"].value = value;}
		},

		/**
		 * Maximum camera distance considered for the SSAO effect.
		 *
		 * @property maxDistance
		 * @type {number}
		 */
		maxDistance:
		{
			get: function() {return self.ssaoMaterial.uniforms["maxDistance"].value;},
			set: function(value) {self.ssaoMaterial.uniforms["maxDistance"].value = value;}
		},

		/**
		 * SSAO effect kernel size.
		 *
		 * @property kernelSize
		 * @type {number}
		 */
		kernelSize:
		{
			get: function(){return self._kernelSize;},
			set: function(value)
			{
				self._kernelSize = value;
				self.generateSampleKernel();
				self.generateRandomKernelRotations();
				self.ssaoMaterial.uniforms["tNoise"].value = self.noiseTexture;
				self.ssaoMaterial.uniforms["kernel"].value = self.kernel;
			}
		}
	});

	this.kernelSize = 64;
	this.kernelRadius = 8;
	this.minDistance = 0.1;
	this.maxDistance = 1000;
}

SSAONOHPass.prototype = Object.create(Pass.prototype);

/** 
 * Generate a sample kernel based on the kernelSize value.
 * 
 * @method generateSampleKernel
 */
SSAONOHPass.prototype.generateSampleKernel = function()
{
	for(var i = 0; i < this._kernelSize; i++)
	{
		var sample = new THREE.Vector3();
		sample.x = (Math.random() * 2) - 1;
		sample.y = (Math.random() * 2) - 1;
		sample.z = Math.random();
		sample.normalize();

		var scale = i / this._kernelSize;
		scale = THREE.Math.lerp(0.1, 1, scale * scale);
		sample.multiplyScalar(scale);
		this.kernel.push(sample);
	}
};

/**
 * Use noise to generate multiple pseudo random kernel rotations.
 *
 * @method generateRandomKernelRotations
 */
SSAONOHPass.prototype.generateRandomKernelRotations = function()
{
	var width = 4, height = 4;

	if(SimplexNoise === undefined)
	{
		console.error("SSAONOHPass: The pass relies on SimplexNoise.");
	}

	var simplex = new SimplexNoise();
	var size = width * height;
	var data = new Float32Array(size);

	for(var i = 0; i < size; i++)
	{
		var x = (Math.random() * 2) - 1;
		var y = (Math.random() * 2) - 1;
		var z = 0;
		data[i] = simplex.noise3d(x, y, z);
	}

	this.noiseTexture = new THREE.DataTexture(data, width, height, THREE.LuminanceFormat, THREE.FloatType);
	this.noiseTexture.wrapS = THREE.RepeatWrapping;
	this.noiseTexture.wrapT = THREE.RepeatWrapping;
	this.noiseTexture.needsUpdate = true;
};

/**
 * Render using this pass.
 * 
 * @method render
 * @param {WebGLRenderer} renderer
 * @param {WebGLRenderTarget} writeBuffer Buffer to write output.
 * @param {WebGLRenderTarget} readBuffer Input buffer.
 * @param {number} delta Delta time in milliseconds.
 * @param {boolean} maskActive Not used in this pass.
 */
SSAONOHPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	// Render configuration
	renderer.autoClear = false;
	renderer.setClearColor(0x7777ff);
	renderer.setClearAlpha(1.0);

	// Render normals
	scene.overrideMaterial = this.normalMaterial;
	renderer.setRenderTarget(this.normalRenderTarget);
	renderer.clear(true, true, true);
	renderer.render(scene, camera);

	scene.overrideMaterial = null;

	// Render SSAO
	this.ssaoMaterial.uniforms["tDepth"].value = this.depthTexture;
	this.ssaoMaterial.uniforms["tDiffuse"].value = readBuffer.texture;
	this.ssaoMaterial.uniforms["cameraNear"].value = camera.near;
	this.ssaoMaterial.uniforms["cameraFar"].value = camera.far;
	this.ssaoMaterial.uniforms["cameraProjectionMatrix"].value.copy(camera.projectionMatrix);
	this.ssaoMaterial.uniforms["cameraInverseProjectionMatrix"].value.getInverse(camera.projectionMatrix); 
	this.renderPass(renderer, this.ssaoMaterial, this.ssaoRenderTarget);

	// Render blur
	this.renderPass(renderer, this.blurMaterial, this.blurRenderTarget);

	// Output to screen
	if(this.renderToScreen)
	{
		// Copy SSAO result
		this.copyMaterial.uniforms["tDiffuse"].value = readBuffer.texture;
		this.copyMaterial.blending = THREE.NoBlending;
		this.renderPass(renderer, this.copyMaterial, null , this.clear);

		// Copy blur and blend it to output
		this.copyMaterial.uniforms["tDiffuse"].value = this.blurRenderTarget.texture;
		this.copyMaterial.blending = THREE.CustomBlending;
		this.renderPass(renderer, this.copyMaterial, null, false);
	}
	// Output to writeBuffer
	else
	{
		// Copy SSAO result
		this.copyMaterial.uniforms["tDiffuse"].value = readBuffer.texture;
		this.copyMaterial.blending = THREE.NoBlending;
		this.renderPass(renderer, this.copyMaterial, writeBuffer, this.clear);

		// Copy blur and blend it to output
		this.copyMaterial.uniforms["tDiffuse"].value = this.blurRenderTarget.texture;
		this.copyMaterial.blending = THREE.CustomBlending;
		this.renderPass(renderer, this.copyMaterial, writeBuffer, false);
	}	
};

/**
 * Render a quad scene using a pass material.
 *
 * @method renderPass
 */
SSAONOHPass.prototype.renderPass = function(renderer, passMaterial, renderTarget, clear)
{
	this.quad.material = passMaterial;

	renderer.autoClear = false;
	renderer.setRenderTarget(renderTarget);

	if(clear)
	{
		renderer.clear(true, true, true);
	}

	renderer.render(this.scene, this.camera);
};

SSAONOHPass.prototype.dispose = function()
{
	// Render targets
	this.normalRenderTarget.dispose();
	this.ssaoRenderTarget.dispose();
	this.blurRenderTarget.dispose();

	// Geometry
	this.quad.geometry.dispose();

	// Materials
	this.normalMaterial.dispose();
	this.blurMaterial.dispose();
	this.copyMaterial.dispose();
};

/**
 * Set resolution of this render pass.
 * 
 * @method setSize
 * @param {number} width
 * @param {number} height
 */
SSAONOHPass.prototype.setSize = function(width, height)
{
	this.ssaoMaterial.uniforms["resolution"].value.set(width, height);
	this.blurMaterial.uniforms["resolution"].value.set(width, height);

	this.normalRenderTarget.setSize(width, height);
	this.ssaoRenderTarget.setSize(width, height);
	this.blurRenderTarget.setSize(width, height);
};

/**
 * Serialize pass to json.
 *
 * @method toJSON
 * @param {Object} meta Metadata object.
 */
SSAONOHPass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);
	
	data.kernelSize = this.kernelSize;
	data.kernelRadius = this.kernelRadius;
	data.minDistance = this.minDistance;
	data.maxDistance = this.maxDistance;

	return data;
};
