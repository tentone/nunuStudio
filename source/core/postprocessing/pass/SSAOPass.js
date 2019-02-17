"use strict";

/**
 * Screen space ambient occlusion (SSAO) pass is used to simulate ambient occlusion shadowing effect.
 *
 * This variant of SSAO produces a halo like effect to simulate the effect.
 * 
 * More information about SSAO here
 *  - http://developer.download.nvidia.com/SDK/10.5/direct3d/Source/ScreenSpaceAO/doc/ScreenSpaceAO.pdf
 *
 * @author alteredq / http://alteredqualia.com/
 * @class SSAOPass
 * @module Postprocessing
 */
function SSAOPass()
{
	ShaderPass.call(this, SSAOShader);

	this.type = "SSAO";

	//Depth material
	this.depthMaterial = new THREE.MeshDepthMaterial();
	this.depthMaterial.depthPacking = THREE.RGBADepthPacking;
	this.depthMaterial.blending = THREE.NoBlending;

	//Depth render target
	this.depthRenderTarget = new THREE.WebGLRenderTarget(2, 2, {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});

	//Shader uniforms
	this.uniforms["tDepth"].value = this.depthRenderTarget.texture;
	this.uniforms["size"].value.set(2, 2);

	//Setters and getters for uniforms
	var self = this;
	Object.defineProperties(this,
	{
		/**
		 * Ambient occlusion shadow radius.
		 *
		 * @property radius
		 * @type {Number}
		 */
		radius:
		{
			get: function() {return this.uniforms["radius"].value;},
			set: function(value) {this.uniforms["radius"].value = value;}
		},

		/**
		 * Display only ambient occlusion result.
		 *
		 * @property onlyAO
		 * @type {Boolean}
		 */
		onlyAO:
		{
			get: function() {return this.uniforms["onlyAO"].value;},
			set: function(value) {this.uniforms["onlyAO"].value = value;}
		},

		/**
		 * Ambient occlusion clamp.
		 *
		 * @property aoClamp
		 * @type {Number}
		 */
		aoClamp:
		{
			get: function() {return this.uniforms["aoClamp"].value;},
			set: function(value) {this.uniforms["aoClamp"].value = value;}
		},

		/**
		 * Pixel luminosity influence in AO calculation.
		 *
		 * @property lumInfluence
		 * @type {Number}
		 */
		lumInfluence:
		{
			get: function() {return this.uniforms["lumInfluence"].value;},
			set: function(value) {this.uniforms["lumInfluence"].value = value;}
		},
	});

	this.radius = 4;
	this.onlyAO = false;
	this.aoClamp = 0.25;
	this.lumInfluence = 0.7;
}

SSAOPass.prototype = Object.create(ShaderPass.prototype);

/**
 * Render using this pass.
 * 
 * @method render
 * @param {WebGLRenderer} renderer
 * @param {WebGLRenderTarget} writeBuffer Buffer to write output.
 * @param {WebGLRenderTarget} readBuffer Input buffer.
 * @param {Number} delta Delta time in milliseconds.
 * @param {Boolean} maskActive Not used in this pass.
 */
SSAOPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	this.uniforms["cameraNear"].value = camera.near;
	this.uniforms["cameraFar"].value = camera.far;

	//Render depth
	scene.overrideMaterial = this.depthMaterial;
	
	renderer.clear();
	renderer.setRenderTarget(this.depthRenderTarget);
	renderer.render(scene, camera);

	//Render shader
	scene.overrideMaterial = null;
	ShaderPass.prototype.render.call(this, renderer, writeBuffer, readBuffer, delta, maskActive);
};


/**
 * Set resolution of this render pass.
 * 
 * @method setSize
 * @param {Number} width
 * @param {Number} height
 */
SSAOPass.prototype.setSize = function(width, height)
{
	this.uniforms["size"].value.set(width, height);
	this.depthRenderTarget.setSize(width, height);
};

/**
 * Serialize pass to json.
 *
 * @method toJSON
 * @param {Object} meta Metadata object.
 */
SSAOPass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);
	
	data.onlyAO = this.onlyAO;
	data.radius = this.radius;
	data.aoClamp = this.aoClamp;
	data.lumInfluence = this.lumInfluence;

	return data;
};
