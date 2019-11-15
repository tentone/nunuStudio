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
	this.createQuadScene();

	this.uniforms = THREE.UniformsUtils.clone(THREE.FilmShader.uniforms);
	this.material = new THREE.ShaderMaterial(
	{
		uniforms: this.uniforms,
		vertexShader: THREE.FilmShader.vertexShader,
		fragmentShader: THREE.FilmShader.fragmentShader
	});

	var self = this;

	Object.defineProperties(this,
	{
		/**
		 * If set true a grascale effect will be applied.
		 *
		 * @property grayscale
		 * @type {boolean}
		 */
		grayscale:
		{
			get: function(){return self.uniforms["grayscale"].value;},
			set: function(value){self.uniforms["grayscale"].value = value;}
		},

		/**
		 * Ammout of noise to be applied to the image.
		 *
		 * @property noiseIntensity
		 * @type {number}
		 */
		noiseIntensity:
		{
			get: function(){return self.uniforms["nIntensity"].value;},
			set: function(value){self.uniforms["nIntensity"].value = value;}
		},

		/**
		 * Scanline intensity.
		 *
		 * @property scanlinesIntensity
		 * @type {number}
		 */
		scanlinesIntensity:
		{
			get: function() {return self.uniforms["sIntensity"].value;},
			set: function(value) {self.uniforms["sIntensity"].value = value;}
		},

		/**
		 * Number of scanline to be displayed.
		 *
		 * @property scanlinesCount
		 * @type {number}
		 */
		scanlinesCount:
		{
			get: function(){return self.uniforms["sCount"].value;},
			set: function(value){self.uniforms["sCount"].value = value;}
		}
	});

	this.grayscale = (grayscale !== undefined) ? grayscale : false;
	this.noiseIntensity = (noiseIntensity !== undefined) ? noiseIntensity : 0.35;
	this.scanlinesIntensity = (scanlinesIntensity !== undefined) ? scanlinesIntensity : 0.5;
	this.scanlinesCount = (scanlinesCount !== undefined) ? scanlinesCount : 512;
};

FilmPass.prototype = Object.create(Pass.prototype);

FilmPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	this.uniforms["time"].value += delta;
	this.uniforms["tDiffuse"].value = readBuffer.texture;

	this.quad.material = this.material;

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

