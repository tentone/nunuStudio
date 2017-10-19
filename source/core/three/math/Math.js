"use strict";

var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
var uuid = "------------------------------------".split("");

THREE.Math.generateUUID = function()
{
	var rnd = Math.random() * 9007199254740991;

	for(var i = 0, j = 0; i < 36; i++, j += 4)
	{	
		if(i === 8 || i === 13 || i === 18 || i === 23)
		{
			continue;
		}

		uuid[i] = chars[(rnd >> j) & 0xf];
	}
	
	return uuid.join("");
};