"use strict";

//Create Color from JSON data
THREE.Color.fromJSON = function(data)
{
	return new THREE.Color(data.r, data.g, data.b);
}