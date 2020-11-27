import {MeshDepthMaterial, RGBADepthPacking, NoBlending, WebGLRenderTarget, LinearFilter} from "three";
import {SSAOShader} from "../shaders/SSAOShader.js";
import {ShaderPass} from "../ShaderPass.js";
import {Pass} from "../Pass.js";

/**
 * Screen space ambient occlusion (SSAO) pass is used to simulate ambient occlusion shadowing effect.
 *
 * This variant of SSAO produces a halo like effect to simulate the effect.
 *
 * More information about SSAO here
 *  - http:// developer.download.nvidia.com/SDK/10.5/direct3d/Source/ScreenSpaceAO/doc/ScreenSpaceAO.pdf
 *
 * @author alteredq / http:// alteredqualia.com/
 * @class SSAOPass
 * @module Postprocessing
 */
function SSAOPass()
{
	ShaderPass.call(this, SSAOShader);

	this.type = "SSAO";

	// Depth material
	this.depthMaterial = new MeshDepthMaterial();
	this.depthMaterial.depthPacking = RGBADepthPacking;
	this.depthMaterial.blending = NoBlending;

	// Depth render target
	this.depthRenderTarget = new WebGLRenderTarget(2, 2, {minFilter: LinearFilter, magFilter: LinearFilter});

	// Shader uniforms
	this.uniforms["tDepth"].value = this.depthRenderTarget.texture;
	this.uniforms["size"].value.set(2, 2);

	// Setters and getters for uniforms
	Object.defineProperties(this,
		{
		/**
		 * Ambient occlusion shadow radius.
		 *
		 * @property radius
		 * @type {number}
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
			 * @type {boolean}
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
			 * @type {number}
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
			 * @type {number}
			 */
			lumInfluence:
		{
			get: function() {return this.uniforms["lumInfluence"].value;},
			set: function(value) {this.uniforms["lumInfluence"].value = value;}
		}
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
 * @param {number} delta Delta time in milliseconds.
 * @param {boolean} maskActive Not used in this pass.
 */
SSAOPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	this.uniforms["cameraNear"].value = camera.near;
	this.uniforms["cameraFar"].value = camera.far;

	// Render depth
	scene.overrideMaterial = this.depthMaterial;

	renderer.setRenderTarget(this.depthRenderTarget);
	renderer.clear(true, true, true);
	renderer.render(scene, camera);

	// Render shader
	scene.overrideMaterial = null;

	ShaderPass.prototype.render.call(this, renderer, writeBuffer, readBuffer, delta, maskActive);
};


/**
 * Set resolution of this render pass.
 *
 * @method setSize
 * @param {number} width
 * @param {number} height
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

export {SSAOPass};
