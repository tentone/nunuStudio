import {InstancedBufferAttribute, BufferAttribute} from "three";

InstancedBufferAttribute.prototype.toJSON = function()
{
	var data = BufferAttribute.prototype.toJSON.call(this);

	data.type = "InstancedBufferAttribute";
	data.meshPerAttribute = this.meshPerAttribute;

	return data;
}
