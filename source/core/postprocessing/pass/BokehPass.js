import {Pass} from "../Pass.js";
import {WebGLRenderTarget, MeshDepthMaterial, RGBADepthPacking, NoBlending, UniformsUtils, ShaderMaterial} from "three";
import {BokehShader} from "three/examples/jsm/shaders/BokehShader";

/**
 * Depth-of-field post-process with bokeh shader.
 * 
 * @class BokehPass
 * @module Postprocessing
 * @param {number} focus Focus distance.
 * @param {number} aperture Camera aperture.
 * @param {number} maxblur Maximum level of blur.
 */

function BokehPass(focus, aperture, maxblur)
{
	Pass.call(this);

	this.type = "Bokeh";

	// Render targets
	this.renderTargetColor = new WebGLRenderTarget(0, 0, Pass.RGBLinear);
	this.renderTargetDepth = this.renderTargetColor.clone();

	// Depth material
	this.materialDepth = new MeshDepthMaterial();
	this.materialDepth.depthPacking = RGBADepthPacking;
	this.materialDepth.blending = NoBlending;

	// Bokeh material
	this.uniforms = UniformsUtils.clone(BokehShader.uniforms);
	this.uniforms["tDepth"].value = this.renderTargetDepth.texture;

	this.materialBokeh = new ShaderMaterial(
	{
		defines: BokehShader.defines,
		uniforms: this.uniforms,
		vertexShader: BokehShader.vertexShader,
		fragmentShader: BokehShader.fragmentShader
	});

	// Scene
	this.createQuadScene();
	this.quad.material = this.materialBokeh;

	// Setters and getters for uniforms
	var self = this;
	Object.defineProperties(this,
	{
		/**
		 * Camera aperture.
		 *
		 * @property aperture
		 * @type {number}
		 */
		aperture:
		{
			get: function() {return self.uniforms["aperture"].value;},
			set: function(value) {self.uniforms["aperture"].value = value;}
		},

		/**
		 * Focus point distance.
		 *
		 * @property focus
		 * @type {number}
		 */
		focus:
		{
			get: function() {return self.uniforms["focus"].value;},
			set: function(value) {self.uniforms["focus"].value = value;}
		},
		
		/**
		 * Maximum level of blur that can be applied to more distant objects.
		 *
		 * @property enabled
		 * @type {maxblur}
		 */
		maxblur:
		{
			get: function() {return self.uniforms["maxblur"].value;},
			set: function(value) {self.uniforms["maxblur"].value = value;}
		},
	});

	this.focus = (focus !== undefined) ? focus : 1.0;
	this.aperture = (aperture !== undefined) ? aperture : 1.0;
	this.maxblur = (maxblur !== undefined) ? maxblur : 0.2;
};

BokehPass.prototype = Object.create(Pass.prototype);

BokehPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	// Render depth into texture
	scene.overrideMaterial = this.materialDepth;

	renderer.autoClear = false;
	renderer.setClearColor(0xFFFFFF);
	renderer.setClearAlpha(1.0);
	renderer.setRenderTarget(this.renderTargetDepth);
	renderer.clear(true, true, true);
	renderer.render(scene, camera);

	// Update camera uniforms
	this.uniforms["tColor"].value = readBuffer.texture;
	this.uniforms["nearClip"].value = camera.near;
	this.uniforms["farClip"].value = camera.far;
	this.uniforms["aspect"].value = camera.aspect;

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
	renderer.render(this.scene, this.camera);

	// Restore scene
	scene.overrideMaterial = null;
};

BokehPass.prototype.setSize = function(width, height)
{
	this.renderTargetColor.setSize(width, height);
	this.renderTargetDepth.setSize(width, height);
};

/**
 * Serialize pass to json.
 *
 * @method toJSON
 * @param {Object} meta Metadata object.
 */
BokehPass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);

	data.aperture = this.aperture;
	data.focus = this.focus;
	data.maxblur = this.maxblur;
	
	return data;
};
export {BokehPass};