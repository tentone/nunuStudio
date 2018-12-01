"use strict";

/**
 * Shader pass is used to apply a post processing effect over an already rendered scene.
 * 
 * @author alteredq / http://alteredqualia.com/
 * @class ShaderPass
 * @module Postprocessing
 */
function ShaderPass(shader, textureID)
{
	Pass.call(this);

	this.type = "Shader";
	this.textureID = (textureID !== undefined ) ? textureID : "tDiffuse";

	if(shader instanceof THREE.ShaderMaterial)
	{
		this.uniforms = shader.uniforms;
		this.material = shader;
	}
	else if(shader)
	{
		this.uniforms = THREE.UniformsUtils.clone(shader.uniforms);
		this.material = new THREE.ShaderMaterial(
		{
			defines: shader.defines || {},
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader
		});
	}

	this.createQuadScene();
};

ShaderPass.prototype = Object.create(Pass.prototype);

ShaderPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive, scene, camera)
{
	if(this.uniforms[this.textureID])
	{
		this.uniforms[this.textureID].value = readBuffer.texture;
	}

	this.quad.material = this.material;

	if(this.renderToScreen)
	{
		renderer.render(this.scene, this.camera, undefined , this.clear);
	}
	else
	{
		renderer.render(this.scene, this.camera, writeBuffer, this.clear);
	}
};
