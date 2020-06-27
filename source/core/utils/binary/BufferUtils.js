/**
 * BufferUtils contains methods to convert from and to Node.js Buffer binary format
 * 
 * @class BufferUtils
 * @module BinaryUtils
 * @static
 */
function BufferUtils(){}

/**
 * Create nodejs buffer from arraybuffer
 *
 * @method fromArrayBuffer
 * @param {Arraybuffer} array
 * @return {Buffer} buffer
 */
BufferUtils.fromArrayBuffer = function(array)
{
	var buffer = new Buffer(array.byteLength);
	var view = new Uint8Array(array);
	
	for(var i = 0; i < buffer.length; i++)
	{
		buffer[i] = view[i];
	}

	return buffer;
};
export {BufferUtils};