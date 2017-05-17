"use strict";

/**
 * Base64Utils contains methods to convert from and to Base64 binary format.
 *
 * @class Base64Utils
 * @module BinaryData
 * @static
 */
function Base64Utils(){}

/**
 * Charset used to encode binary data.
 *
 * @attribute encoding
 * @type {String}
 */
Base64Utils.encoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/**
 * Remove base64 header from data.
 * 
 * Usefull for removing the heander from image, audio, video, etc.
 *
 * @method removeHeader
 * @param {String} base64
 * @return {String} base64
 */
Base64Utils.removeHeader = function(data)
{
	return data.slice(data.search(";base64,") + 8);
};

/**
 * Get the file format present in the base64 string.
 *
 * @method getFileFormat
 * @param  {String} data Base64 data.
 * @return {String} File format present in the JSON data.
 */
Base64Utils.getFileFormat = function(data)
{
	var start = data.indexOf("/") + 1;
	var end = data.indexOf(";");
	
	return data.substr(start, end - start);
};

/**
 * Create base64 string from arraybuffer.
 *
 * @method fromArraybuffer
 * @param {Arraybuffer} arraybuffer
 * @return {String} base64
 */
Base64Utils.fromArraybuffer = function(arraybuffer)
{
	var base64 = "";

	var view = new Uint8Array(arraybuffer);
	var remainder = view.byteLength % 3;
	var length = view.byteLength - remainder;

	var a, b, c, d;
	var chunk;

	//Chunks of 3 bytes for cycle
	for(var i = 0; i < length; i += 3)
	{
		chunk = (view[i] << 16) | (view[i + 1] << 8) | view[i + 2];

		a = (chunk & 16515072) >> 18;
		b = (chunk & 258048) >> 12;
		c = (chunk & 4032) >> 6;
		d = chunk & 63;

		base64 += Base64Utils.encoding[a] + Base64Utils.encoding[b] + Base64Utils.encoding[c] + Base64Utils.encoding[d]
	}

	//Remaining bytes
	if(remainder === 1)
	{
		chunk = view[length];

		a = (chunk & 252) >> 2;
		b = (chunk & 3) << 4;

		base64 += Base64Utils.encoding[a] + Base64Utils.encoding[b] + "==";
	}
	else if(remainder === 2)
	{
		chunk = (view[length] << 8) | view[length + 1];

		a = (chunk & 64512) >> 10;
		b = (chunk & 1008) >> 4;
		c = (chunk & 15) << 2;

		base64 += Base64Utils.encoding[a] + Base64Utils.encoding[b] + Base64Utils.encoding[c] + "=";
	}

	return base64;
};

/**
 * Create base64 string from binary string.
 *
 * @method fromBinaryString
 * @param {String} str
 * @return {String} base64
 */
Base64Utils.fromBinaryString = function(str)
{
	var base64 = "";
	var remainder = str.length % 3;
	var length = str.length - remainder;

	var a, b, c;

	for(var i = 0; i < length; i += 3)
	{
		a = str.charCodeAt(i) & 0xff;
		b = str.charCodeAt(i + 1);
		c = str.charCodeAt(i + 2);

		base64 += Base64Utils.encoding.charAt(a >> 2);
		base64 += Base64Utils.encoding.charAt(((a & 0x3) << 4) | ((b & 0xF0) >> 4));
		base64 += Base64Utils.encoding.charAt(((b & 0xF) << 2) | ((c & 0xC0) >> 6));
		base64 += Base64Utils.encoding.charAt(c & 0x3F);
	}
	
	if(remainder === 1)
	{
		a = str.charCodeAt(i) & 0xff;

		base64 += Base64Utils.encoding.charAt(a >> 2);
		base64 += Base64Utils.encoding.charAt((a & 0x3) << 4);
		base64 += "==";
	}
	else if(remainder === 2)
	{
		a = str.charCodeAt(i) & 0xff;
		b = str.charCodeAt(i + 1);

		base64 += Base64Utils.encoding.charAt(a >> 2);
		base64 += Base64Utils.encoding.charAt(((a & 0x3) << 4) | ((b & 0xF0) >> 4));
		base64 += Base64Utils.encoding.charAt((b & 0xF) << 2);
		base64 += "=";
	}

	return base64;
};