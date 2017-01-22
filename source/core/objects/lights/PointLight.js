"use strict";

function PointLight(hex, intensity, distance, decay)
{
	THREE.PointLight.call(this, hex, intensity, distance, decay);

	this.name = "point";
	
	this.castShadow = true;

	this.shadow.camera.near = 0.05;
	this.shadow.camera.far = 5000;
	this.shadow.bias = 0.01;
}

//Function Prototype
PointLight.prototype = Object.create(THREE.PointLight.prototype);

//Update ligth shadow map
PointLight.prototype.updateShadowMap = function()
{
	this.shadow.map.dispose();
	this.shadow.map = null;
	this.shadow.camera.updateProjectionMatrix();
}
