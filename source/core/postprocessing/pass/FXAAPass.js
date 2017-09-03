"use strict";

function FXAAPass()
{
	ShaderPass.call(this, THREE.FXAAShader);

	this.type = "FXAA";
}

FXAAPass.prototype = Object.create(ShaderPass.prototype);

FXAAPass.prototype.setSize = function(width, height)
{
	this.uniforms["resolution"].value.set(1 / width, 1 / height);
};