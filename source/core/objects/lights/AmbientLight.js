"use strict";

function AmbientLight(hex)
{
	THREE.AmbientLight.call(this, hex);
	
	this.name = "ambient";

	this.matrixAutoUpdate = false;
}

//Function Prototype
AmbientLight.prototype = Object.create(THREE.AmbientLight.prototype);