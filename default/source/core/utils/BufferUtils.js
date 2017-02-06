"use strict";

function BufferUtils(){}

//Create nodejs buffer from arraybuffer
BufferUtils.fromArrayBuffer = function(array)
{
	var buffer = new Buffer(array.byteLength);
	var view = new Uint8Array(array);
	
	for(var i = 0; i < buffer.length; i++)
	{
		buffer[i] = view[i];
	}

	return buffer;
}
