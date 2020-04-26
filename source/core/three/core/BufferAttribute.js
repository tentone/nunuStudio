"use strict";

THREE.BufferAttribute.prototype.toJSON = function()
{
	return {
		bufferType: "BufferAttribute",
		itemSize: this.itemSize,
		type: this.array.constructor.name,
		array: Array.prototype.slice.call(this.array),
		normalized: this.normalized
	};
}
