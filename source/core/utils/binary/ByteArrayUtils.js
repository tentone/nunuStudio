/**
 * ByteArrayUtils contains methods to convert from and to ByteArray binary format
 * 
 * A byte array is a numeric array that stores a 8 bit (0 to 255) value for each position.
 *
 * @class ByteArrayUtils
 * @module BinaryUtils
 * @static
 */
function ByteArrayUtils(){}

/**
 * Create byte array from base64 string data.
 *
 * @method fromBase64
 * @param {string} base64
 * @return {Array} data
 */
ByteArrayUtils.fromBase64 = function(str)
{
	var encoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var length = str.length / 4 * 3;
	var array = [];

	var a, b, c, d;

	for(var i = 0, j = 0; i < length; i += 3)
	{
		a = encoding.indexOf(str.charAt(j++));
		b = encoding.indexOf(str.charAt(j++));
		c = encoding.indexOf(str.charAt(j++));
		d = encoding.indexOf(str.charAt(j++));

		array[i] = (a << 2) | (b >> 4);
		if(c !== 64)
		{
			array[i+1] = ((b & 15) << 4) | (c >> 2);
		}
		if(d !== 64)
		{
			array[i+2] = ((c & 3) << 6) | d;
		}
	}

	return array;
};
export {ByteArrayUtils};