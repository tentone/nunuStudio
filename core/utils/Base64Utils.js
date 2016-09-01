"use strict";

function Base64Utils(){}

//Create base64 string from arraybuffer
Base64Utils.fromArraybuffer = function(arraybuffer)
{
	var encoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
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

		a = (chunk & 16515072) >> 18; //16515072 = (2^6 - 1) << 18
		b = (chunk & 258048) >> 12; //258048 = (2^6 - 1) << 12
		c = (chunk & 4032) >> 6; //4032 = (2^6 - 1) << 6
		d = chunk & 63; //63 = 2^6 - 1

		base64 += encoding[a] + encoding[b] + encoding[c] + encoding[d]
	}

	//Remaining bytes and padding
	if(remainder === 1)
	{
		chunk = view[length];

		a = (chunk & 252) >> 2;
		b = (chunk & 3) << 4;

		base64 += encoding[a] + encoding[b] + "==";
	}
	else if(remainder === 2)
	{
		chunk = (view[length] << 8) | view[length + 1];

		a = (chunk & 64512) >> 10; //64512 = (2^6 - 1) << 10
		b = (chunk & 1008) >> 4; //1008  = (2^6 - 1) << 4
		c = (chunk & 15) << 2; //15 = 2^4 - 1 (Set the 2 LSB to zero)

		base64 += encoding[a] + encoding[b] + encoding[c] + "=";
	}

	return base64;
}

//Create base64 string from binary string
Base64Utils.fromBinaryString = function(str)
{
	var encoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	var base64 = "";
	var length = str.length;

	var a, b, c;

	var i = 0;
	while(i < length)
	{
		a = str.charCodeAt(i++) & 0xff;
		if(i === length)
		{
			base64 += encoding.charAt(a >> 2);
			base64 += encoding.charAt((a & 0x3) << 4);
			base64 += "==";
			break;
		}

		b = str.charCodeAt(i++);
		if(i === length)
		{
			base64 += encoding.charAt(a >> 2);
			base64 += encoding.charAt(((a & 0x3) << 4) | ((b & 0xF0) >> 4));
			base64 += encoding.charAt((b & 0xF) << 2);
			base64 += "=";
			break;
		}

		c = str.charCodeAt(i++);
		base64 += encoding.charAt(a >> 2);
		base64 += encoding.charAt(((a & 0x3) << 4) | ((b & 0xF0) >> 4));
		base64 += encoding.charAt(((b & 0xF) << 2) | ((c & 0xC0) >> 6));
		base64 += encoding.charAt(c & 0x3F);
	}
	
	return base64;
}