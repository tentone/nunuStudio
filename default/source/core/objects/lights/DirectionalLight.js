"use strict";

function DirectionalLight(hex, intensity)
{
	THREE.DirectionalLight.call(this, hex, intensity);

	this.name = "directional light";
	
	this.castShadow = true;
	
	this.shadow.camera.near = 0.5;
	this.shadow.camera.far = 10000;
}

DirectionalLight.prototype = Object.create(THREE.DirectionalLight.prototype);

//Update ligth shadow map
DirectionalLight.prototype.updateShadowMap = function()
{
	this.shadow.map.dispose();
	this.shadow.map = null;
	this.shadow.camera.updateProjectionMatrix();
}
