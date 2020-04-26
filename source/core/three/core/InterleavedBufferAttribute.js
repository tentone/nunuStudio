"use strict";

THREE.InterleavedBufferAttribute.prototype.toJSON = function()
{
	return {
		bufferType: "InterleavedBufferAttribute",
		data: this.data.toJSON(),
		itemSize: this.itemSize,
		offset: this.offset,
		normalized: this.normalized
	};
};