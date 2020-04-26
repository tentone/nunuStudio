"use strict";

THREE.InstancedBufferAttribute.prototype.toJSON = function()
{
	var data = BufferAttribute.prototype.toJSON.call(this);

	data.bufferType = "InstancedBufferAttribute";
	data.meshPerAttribute = this.meshPerAttribute;

	return data;
}
