"use strict";

/**
 * Film pass is used to simulate a film/TV like effect.
 *
 * @class FilmPass
 * @module Postprocessing
 * @author alteredq / http://alteredqualia.com/
 */
function FilmPass(noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale)
{
	if(THREE.FilmShader === undefined)
	{
		console.error("FilmPass relies on THREE.FilmShader");
	}

	Pass.call(this);

	this.type = "Film";

	this.uniforms = THREE.UniformsUtils.clone(THREE.FilmShader.uniforms);
	this.material = new THREE.ShaderMaterial(
	{
		uniforms: this.uniforms,
		vertexShader: THREE.FilmShader.vertexShader,
		fragmentShader: THREE.FilmShader.fragmentShader
	});

	this.uniforms.grayscale.value = (grayscale !== undefined) ? grayscale : false;
	this.uniforms.nIntensity.value = (noiseIntensity !== undefined) ? noiseIntensity : 0.35;
	this.uniforms.sIntensity.value = (scanlinesIntensity !== undefined) ? scanlinesIntensity : 0.5;
	this.uniforms.sCount.value = (scanlinesCount !== undefined) ? scanlinesCount : 512;

	this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	this.scene  = new THREE.Scene();
	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
	this.quad.frustumCulled = false;
	this.scene.add(this.quad);

	//Setters and getters for uniforms
	var self = this;
	Object.defineProperties(this,
	{
		/**
		 * If set true a grascale effect will be applied.
		 *
		 * @property grayscale
		 * @type {Boolean}
		 */
		grayscale:
		{
			get: function() {return this.uniforms["grayscale"].value;},
			set: function(value) {this.uniforms["grayscale"].value = value;}
		},

		/**
		 * Ammout of noise to be applied to the image.
		 *
		 * @property noiseIntensity
		 * @type {Number}
		 */
		noiseIntensity:
		{
			get: function() {return this.uniforms["nIntensity"].value;},
			set: function(value) {this.uniforms["nIntensity"].value = value;}
		},

		/**
		 * Scanline intensity.
		 *
		 * @property scanlinesIntensity
		 * @type {Number}
		 */
		scanlinesIntensity:
		{
			get: function() {return this.uniforms["sIntensity"].value;},
			set: function(value) {this.uniforms["sIntensity"].value = value;}
		},

		/**
		 * Number of scanline to be displayed.
		 *
		 * @property scanlinesCount
		 * @type {Number}
		 */
		scanlinesCount:
		{
			get: function() {return this.uniforms["sCount"].value;},
			set: function(value) {this.uniforms["sCount"].value = value;}
		}
	});
};

FilmPass.prototype = Object.create(Pass.prototype);

FilmPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	this.uniforms["tDiffuse"].value = readBuffer.texture;
	this.uniforms["time"].value += delta;

	this.quad.material = this.material;

	if(this.renderToScreen)
	{
		renderer.render(this.scene, this.camera);
	}
	else
	{
		renderer.render(this.scene, this.camera, writeBuffer, this.clear);
	}
};

FilmPass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);

	data.grayscale = this.grayscale;
	data.noiseIntensity = this.noiseIntensity;
	data.scanlinesIntensity = this.scanlinesIntensity;
	data.scanlinesCount = this.scanlinesCount;

	return data;
};

