"use strict";

/**
 * DotScreen pass generates a poster like effect on top of the scene.
 *  
 * @class DotScreenPass
 * @module Postprocessing
 * @author alteredq / http://alteredqualia.com/
 * @param {Number} center Dot rotation center.
 * @param {Number} angle Dot rotation angle.
 * @param {Number} scale Dot scale.
 */
function DotScreenPass(center, angle, scale)
{
	if(THREE.DotScreenShader === undefined)
	{
		console.error("DotScreenPass relies on THREE.DotScreenShader");
	}

	Pass.call(this);

	this.type = "DotScreen";
	this.createQuadScene();

	this.uniforms = THREE.UniformsUtils.clone(THREE.DotScreenShader.uniforms);

	this.material = new THREE.ShaderMaterial(
	{
		uniforms: this.uniforms,
		vertexShader: THREE.DotScreenShader.vertexShader,
		fragmentShader: THREE.DotScreenShader.fragmentShader
	});

	//Setters and getters for uniforms
	var self = this;
	Object.defineProperties(this,
	{
		/**
		 * Center of rotation of the dot grid in normalized coordinates.
		 *
		 * @property center
		 * @type {Vector2}
		 */
		center:
		{
			get: function() {return this.uniforms["center"].value;},
			set: function(value) {this.uniforms["center"].value = value;}
		},

		/**
		 * Rotation of the dot grid.
		 *
		 * @property angle
		 * @type {Number}
		 */
		angle:
		{
			get: function() {return this.uniforms["angle"].value;},
			set: function(value) {this.uniforms["angle"].value = value;}
		},

		/**
		 * Scale of the dots used in the effect.
		 *
		 * @property scale
		 * @type {Number}
		 */
		scale:
		{
			get: function() {return this.uniforms["scale"].value;},
			set: function(value) {this.uniforms["scale"].value = value;}
		}
	});

	if(center !== undefined)
	{
		this.center.copy(center);
	}
	
	this.angle = angle !== undefined ? angle : 0.5;
	this.scale = scale !== undefined ? scale : 0.8;
};

DotScreenPass.prototype = Object.create(Pass.prototype);

DotScreenPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	this.uniforms["tDiffuse"].value = readBuffer.texture;
	this.uniforms["tSize"].value.set(readBuffer.width, readBuffer.height);

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

DotScreenPass.prototype.toJSON = function(meta)
{
	var data = Pass.prototype.toJSON.call(this, meta);

	data.center = this.center.toArray();
	data.angle = this.angle;
	data.scale = this.scale;

	return data;
};

