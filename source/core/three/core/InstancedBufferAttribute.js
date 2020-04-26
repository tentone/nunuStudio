"use strict";

THREE.InstancedBufferAttribute.prototype.toJSON = function()
{
	var data = THREE.BufferAttribute.prototype.toJSON.call(this);

	data.type = "InstancedBufferAttribute";
	data.meshPerAttribute = this.meshPerAttribute;

	return data;
}
