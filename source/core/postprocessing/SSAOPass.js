"use strict";

function SSAOPass(scene, camera, width, height)
{
	if(THREE.SSAOShader === undefined)
	{
		console.warn("THREE.SSAOPass depends on THREE.SSAOShader");
		return new THREE.ShaderPass();
	}

	THREE.ShaderPass.call(this, THREE.SSAOShader);

	this.width = (width !== undefined) ? width : 512;
	this.height = (height !== undefined) ? height : 512;

	this.renderToScreen = false;

	this.camera2 = camera;
	this.scene2 = scene;

	//Depth material
	this.depthMaterial = new THREE.MeshDepthMaterial();
	this.depthMaterial.depthPacking = THREE.RGBADepthPacking;
	this.depthMaterial.blending = THREE.NoBlending;

	//Depth render target
	this.depthRenderTarget = new THREE.WebGLRenderTarget(this.width, this.height, {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter});
	this.depthRenderTarget.texture.name = "SSAOShader.rt";
	
	//Shader uniforms
	this.uniforms["tDepth"].value = this.depthRenderTarget.texture;
	this.uniforms["size"].value.set(this.width, this.height);
	this.uniforms["cameraNear"].value = this.camera2.near;
	this.uniforms["cameraFar"].value = this.camera2.far;

	this.uniforms["radius"].value = 4;
	this.uniforms["onlyAO"].value = false;
}

SSAOPass.prototype = Object.create(THREE.ShaderPass.prototype);

SSAOPass.prototype.render = function(renderer, writeBuffer, readBuffer, delta, maskActive)
{
	//Render depth into depthRenderTarget
	this.scene2.overrideMaterial = this.depthMaterial;
	renderer.render(this.scene2, this.camera2, this.depthRenderTarget, true);
	
	//Render renderPass and SSAO shaderPass
	this.scene2.overrideMaterial = null;
	THREE.ShaderPass.prototype.render.call(this, renderer, writeBuffer, readBuffer, delta, maskActive);
};

SSAOPass.prototype.setSize = function(width, height)
{
	this.width = width;
	this.height = height;

	this.uniforms["size"].value.set(this.width, this.height);
	this.depthRenderTarget.setSize(this.width, this.height);
};
