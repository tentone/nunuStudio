"use strict";

THREE.InterleavedBufferAttribute.prototype.toJSON = function()
{
	return {
		type: "InterleavedBufferAttribute",
		data: this.data.toJSON(),
		itemSize: this.itemSize,
		offset: this.offset,
		normalized: this.normalized
	};
};

var typedArray = new TYPED_ARRAYS[json.type](json.array);