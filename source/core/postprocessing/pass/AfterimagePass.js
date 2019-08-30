"use strict";

/**
 * After image render pass blends the current frame with the previous frame.
 *
 * A dampening value is applied in the blend, that is performed additively.
 *  
 * @class AfterimagePass
 * @module Postprocessing
 */
function AfterimagePass(damp)
{
	if(THREE.AfterimageShader === undefined)
	{
		console.error("AfterimagePass relies on THREE.AfterimageShader");
	}

	Pass.call(this);

	this.type = "Afterimage";

	this.uniforms = THREE.UniformsUtils.clone(THREE.AfterimageShader.uniforms);

	this.textureComp = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
	{
		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat
	});

	this.textureOld = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight,
	{
		minFilter: THREE.LinearFilter,
		magFilter: THREE.NearestFilter,
		format: THREE.RGBAFormat
	});

	this.shaderMaterial = new THREE.ShaderMaterial(
	{
		uniforms: this.uniforms,
		vertexShader: THREE.AfterimageShader.vertexShader,
		fragmentShader: THREE.AfterimageShader.fragmentShader
	});


	this.compFsQuad = new THREE.Pass.FullScreenQuad(this.shaderMaterial);
	this.copyFsQuad = new THREE.Pass.FullScreenQuad(new THREE.MeshBasicMaterial());

	var self = this;
	Object.defineProperties(this,
	{
		/**
		 * Dampening applied to the previous frame.
		 *
		 * @property damp
		 * @type {Number}
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
	// Swap buffers.
	this.uniforms["tOld"].value = this.textureOld.texture;
	this.uniforms["tNew"].value = readBuffer.texture;

	// Render textureComp
	renderer.setRenderTarget(this.textureComp);
	this.compFsQuad.render(renderer);

	// Set copy from texture
	this.copyFsQuad.material.map = this.textureComp.texture;

	// Clear configuration
	if(this.clear)
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

	renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
	this.copyFsQuad.render(renderer);
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

