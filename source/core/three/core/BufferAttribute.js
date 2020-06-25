import {BufferAttribute} from "three";

BufferAttribute.prototype.toJSON = function()
{
	return {
		type: "BufferAttribute",
		typedArray: {
			type: this.array.constructor.name,
			array: Array.prototype.slice.call(this.array)
		},
		itemSize: this.itemSize,
		normalized: this.normalized
	};
}
