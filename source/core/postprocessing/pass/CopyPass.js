"use strict";

function CopyPass()
{
	ShaderPass.call(this, THREE.CopyShader);

	this.type = "Copy";
}

CopyPass.prototype = Object.create(ShaderPass.prototype);
