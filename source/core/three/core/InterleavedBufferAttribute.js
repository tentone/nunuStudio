import {InterleavedBufferAttribute} from "three";

InterleavedBufferAttribute.prototype.toJSON = function()
{
	return {
		type: "InterleavedBufferAttribute",
		data: this.data.toJSON(),
		itemSize: this.itemSize,
		offset: this.offset,
		normalized: this.normalized
	};
};
