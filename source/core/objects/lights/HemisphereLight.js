"use strict";

function HemisphereLight(skyColor, groundColor, intensity)
{
	THREE.HemisphereLight.call(this, skyColor, groundColor, intensity);

	this.name = "hemisphere_light";
}

HemisphereLight.prototype = Object.create(THREE.HemisphereLight.prototype);
