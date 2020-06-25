import {Pass} from "../Pass.js";
import {Scene} from "../../objects/Scene.js";
import {ShaderMaterial, UniformsUtils} from "three";

/**
 * Shader pass is used to apply a post processing effect over an already rendered scene.
 * 
 * @author alteredq / http:// alteredqualia.com/
 * @class ShaderPass
 * @module Postprocessing
 */
function ShaderPass(shader, textureID)
{
	Pass.call(this);

	this.type = "Shader";
	this.textureID = (textureID !== undefined ) ? textureID : "tDiffuse";

	if(shader instanceof ShaderMaterial)
	{
		this.uniforms = shader.uniforms;
		this.material = shader;
	}
	else if(shader)
	{
		this.uniforms = UniformsUtils.clone(shader.uniforms);
		this.material = new ShaderMaterial(
		{
			defines: Object.assign({}, shader.defines),
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

	renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);

	if(this.clear)
	{
		renderer.clear();
	}

	renderer.render(this.scene, this.camera);
};

export {ShaderPass};