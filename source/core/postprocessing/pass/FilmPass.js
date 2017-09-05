/**
 * Film pass is used to simulate a film/TV like effect.
 *
 * Has the following parameters
 *  - grayscale
 *  - noiseIntensity
 *  - scanlinesIntensity
 *  - scanlinesCount
 *
 * @class FilmPass
 * @constructor
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
	this.material = new THREE.ShaderMaterial({
		uniforms: this.uniforms,
		vertexShader: THREE.FilmShader.vertexShader,
		fragmentShader: THREE.FilmShader.fragmentShader
	});

	if (grayscale !== undefined) this.uniforms.grayscale.value = grayscale;
	if (noiseIntensity !== undefined) this.uniforms.nIntensity.value = noiseIntensity;
	if (scanlinesIntensity !== undefined) this.uniforms.sIntensity.value = scanlinesIntensity;
	if (scanlinesCount !== undefined) this.uniforms.sCount.value = scanlinesCount;

	this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
	this.scene  = new THREE.Scene();
	this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
	this.quad.frustumCulled = false;
	this.scene.add(this.quad);

	//Setters and getters for uniforms
	var self = this;
	Object.defineProperties(this,
	{
		grayscale:
		{
			get: function() {return this.uniforms["grayscale"].value;},
			set: function(value) {this.uniforms["grayscale"].value = value;}
		},

		noiseIntensity:
		{
			get: function() {return this.uniforms["nIntensity"].value;},
			set: function(value) {this.uniforms["nIntensity"].value = value;}
		},

		scanlinesIntensity:
		{
			get: function() {return this.uniforms["sIntensity"].value;},
			set: function(value) {this.uniforms["sIntensity"].value = value;}
		},

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

