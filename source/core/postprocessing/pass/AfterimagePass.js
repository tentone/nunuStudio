import {UniformsUtils, WebGLRenderTarget, LinearFilter, NearestFilter, RGBAFormat, ShaderMaterial, MeshBasicMaterial} from "three";
import {AfterimageShader} from "three/examples/jsm/shaders/AfterimageShader";
import {Pass} from "../Pass.js";

/**
 * After image render pass blends the current frame with the previous frame.
 *
 * A dampening value is applied in the blend, that is performed additively.
 *  
 *
 * @class AfterimagePass
 * @module Postprocessing
 */
function AfterimagePass(damp)
{
	Pass.call(this);

	this.type = "Afterimage";

	this.uniforms = UniformsUtils.clone(AfterimageShader.uniforms);

	this.textureComp = new WebGLRenderTarget(1, 1,
		{
			minFilter: LinearFilter,
			magFilter: NearestFilter,
			format: RGBAFormat
		});

	this.textureOld = new WebGLRenderTarget(1, 1,
		{
			minFilter: LinearFilter,
			magFilter: NearestFilter,
			format: RGBAFormat
		});

	this.shaderMaterial = new ShaderMaterial(
		{
			uniforms: this.uniforms,
			vertexShader: AfterimageShader.vertexShader,
			fragmentShader: AfterimageShader.fragmentShader
		});

	this.basicMaterial = new MeshBasicMaterial();

	this.createQuadScene();

	var self = this;
	Object.defineProperties(this,
		{
		/**
		 * Dampening applied to the previous frame.
		 *
		 * @property damp
		 * @type {number}
		 */
			damp:
		{
			get: function() {return this.uniforms["damp"].value;},
			set: function(value) {this.uniforms["damp"].value = value;}
		}
		});

	this.damp = damp !== undefined ? damp : 0.96;
};

AfterimagePass.prototype = Object.create(Pass.prototype);

AfterimagePass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	// Swap texture
	var temp = this.textureOld;
	this.textureOld = this.textureComp;
	this.textureComp = temp;

	// Setup uniforms
	this.uniforms["tNew"].value = readBuffer.texture;
	this.uniforms["tOld"].value = this.textureOld.texture;

	// Render textureComp
	this.quad.material = this.shaderMaterial;
	renderer.autoClear = false;
	renderer.setRenderTarget(this.textureComp);
	renderer.render(this.scene, this.camera);

	// Set copy from texture
	this.basicMaterial.map = this.textureComp.texture;

	// Clear configuration
	if (this.clear)
	{
		renderer.autoClear = true;
		renderer.autoClearColor = true;
		renderer.autoClearDepth = true;
		renderer.autoClearStencil = true;
	}
	else
	{
		renderer.autoClear = false;
	}

	this.quad.material = this.basicMaterial;
	renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
	renderer.render(this.scene, this.camera);
};


AfterimagePass.prototype.setSize = function(width, height)
{
	this.textureComp.setSize(width, height);
	this.textureOld.setSize(width, height);
};

AfterimagePass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);

	data.damp = this.damp;

	return data;
};


export {AfterimagePass};
