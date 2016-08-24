"use strict";

function DirectionalLight(hex, intensity)
{
	THREE.DirectionalLight.call(this, hex, intensity);

	this.name = "directional_light";
	
	this.castShadow = true;
	
	this.shadow.camera.near = 0;
	this.shadow.camera.far = 10000;
	this.shadow.camera.left = -10;
	this.shadow.camera.right = 10;
	this.shadow.camera.top = 10;
	this.shadow.camera.bottom = -10;
	this.shadow.mapSize.width = 1024;
	this.shadow.mapSize.height = 1024;
}

//Function Prototype
DirectionalLight.prototype = Object.create(THREE.DirectionalLight.prototype);

//Update ligth shadow map
DirectionalLight.prototype.updateShadowMap = function()
{
	this.shadow.map.dispose();
	this.shadow.map = null;

	this.shadow.camera.updateProjectionMatrix();
}