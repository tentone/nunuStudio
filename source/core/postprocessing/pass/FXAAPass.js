"use strict";

function FXAAPass()
{
	ShaderPass.call(this, THREE.FXAAShader);

	this.type = "FXAA";
}

FXAAPass.prototype = Object.create(ShaderPass.prototype);

FXAAPass.prototype.setSize = function(x, y)
{
	this.uniforms["resolution"].value.set(1 / x, 1 / y);
};