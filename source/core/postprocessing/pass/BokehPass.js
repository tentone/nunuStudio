"use strict";

/**
 * Depth-of-field post-process with bokeh shader.
 * 
 * @class BokehPass
 * @module Postprocessing
 * @param {Number} focus Focus distance.
 * @param {Number} aperture Camera aperture.
 * @param {Number} maxblur Maximum level of blur.
 */
/**
 * Focus point distance.
 *
 * @property focus
 * @type {Number}
 */
/**
 * Camera aperture.
 *
 * @property aperture
 * @type {Number}
 */
/**
 * Maximum level of blur that can be applied to more distant objects.
 *
 * @property enabled
 * @type {maxblur}
 */
function BokehPass(focus, aperture, maxblur)
{
	if(THREE.BokehShader === undefined)
	{
		console.error("BokehPass relies on THREE.BokehShader");
	}

	Pass.call(this);

	this.type = "Bokeh";
	this.needsSwap = false;

	//Render targets
	this.renderTargetColor = new THREE.WebGLRenderTarget(0, 0,
	{
		minFilter: THREE.LinearFilter,
		magFilter: THREE.LinearFilter,
		format: THREE.RGBFormat
	});
	this.renderTargetDepth = this.renderTargetColor.clone();

	//Depth material
	this.materialDepth = new THREE.MeshDepthMaterial();
	this.materialDepth.depthPacking = THREE.RGBADepthPacking;
	this.materialDepth.blending = THREE.NoBlending;

	//Bokeh material
	this.uniforms = THREE.UniformsUtils.clone(THREE.BokehShader.uniforms);
	this.uniforms["tDepth"].value = this.renderTargetDepth.texture;
	this.uniforms["focus"].value = (focus !== undefined) ? focus : 1.0;
	this.uniforms["aperture"].value = (aperture !== undefined) ? aperture : 1.0;
	this.uniforms["maxblur"].value = (maxblur !== undefined) ? maxblur : 0.2;

	this.materialBokeh = new THREE.ShaderMaterial({
		defines: THREE.BokehShader.defines,
		uniforms: this.uniforms,
		vertexShader: THREE.BokehShader.vertexShader,
		fragmentShader: THREE.BokehShader.fragmentShader
	});

	//Scene
	this.scene  = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
	this.quad.material = this.materialBokeh;
	this.quad.frustumCulled = false;
	this.scene.add(this.quad);

	//Backup clear color and alpha
	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;
	this.oldAutoClear = false;

	//Setters and getters for uniforms
	var self = this;
	Object.defineProperties(this,
	{
		aperture:
		{
			get: function() {return this.uniforms["aperture"].value;},
			set: function(value) {this.uniforms["aperture"].value = value;}
		},

		focus:
		{
			get: function() {return this.uniforms["focus"].value;},
			set: function(value) {this.uniforms["focus"].value = value;}
		},

		maxblur:
		{
			get: function() {return this.uniforms["maxblur"].value;},
			set: function(value) {this.uniforms["maxblur"].value = value;}
		},
	});
};

BokehPass.prototype = Object.create(Pass.prototype)

BokehPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	//Backup renderer configuration
	this.oldClearColor.copy(renderer.getClearColor());
	this.oldClearAlpha = renderer.getClearAlpha();
	this.oldAutoClear = renderer.autoClear;

	//Render depth into texture
	scene.overrideMaterial = this.materialDepth;

	renderer.autoClear = false;
	renderer.setClearColor(0xffffff);
	renderer.setClearAlpha(1.0);
	renderer.render(scene, camera, this.renderTargetDepth, true);

	//Update camera uniforms
	this.uniforms["tColor"].value = readBuffer.texture;
	this.uniforms["nearClip"].value = camera.near;
	this.uniforms["farClip"].value = camera.far;
	this.uniforms["aspect"].value = camera.aspect;

	//Render bokeh composite
	if(this.renderToScreen)
	{
		renderer.render(this.scene, this.camera);
	}
	else
	{
		renderer.render(this.scene, this.camera, writeBuffer, this.clear);
	}	

	//Restore scene and renderer
	scene.overrideMaterial = null;
	renderer.setClearColor(this.oldClearColor);
	renderer.setClearAlpha(this.oldClearAlpha);
	renderer.autoClear = this.oldAutoClear;
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