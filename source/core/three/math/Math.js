"use strict";

var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
var random = 0;
var table = [];
for(var i = 0; i < 289; i ++)
{
	table[i] = chars[(i / 17) | 0] + chars[i % 17];
}

THREE.Math.generateUUID = function()
{
	var uuid = "";
	var temp, byte, value;

	for(var i = 0; i < 36; i++)
	{
		if(i === 8 || i === 13 || i === 18 || i === 23)
		{
			uuid += "-";
			continue;
		}

		if(random <= 0x02)
		{
			random = 0x2000000 + (Math.random() * 0x8000000);
		}

		byte = random & 0xf;
		random = random >> 1;
		value = (i === 19) ? (byte & 0x3) | 0x8 : byte;

		if((i % 2) === 0)
		{
			temp = value;
		}
		else
		{
			uuid += table[(temp * 17) + value];
		}
	}

	return uuid;
};
