import {BufferAttribute} from "three";

THREE.InstancedBufferAttribute.prototype.toJSON = function()
{
	var data = BufferAttribute.prototype.toJSON.call(this);

	data.type = "InstancedBufferAttribute";
	data.meshPerAttribute = this.meshPerAttribute;

	return data;
}
