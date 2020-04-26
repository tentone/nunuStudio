"use strict";

THREE.InterleavedBuffer.prototype.toJSON = function()
{
	return {
		type: this.array.constructor.name,
		array: Array.prototype.slice.call(this.array),

		stride: this.stride,
		count: this.count,

		usage: this.usage,
		updateRange: this.updateRange,
		version: this.version
	};
};
