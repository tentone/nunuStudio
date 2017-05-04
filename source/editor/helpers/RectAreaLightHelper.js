"use strict";

function RectAreaLightHelper(light) 
{
	this.material = new THREE.MeshBasicMaterial();
	this.material.color.copy(light.color);
	this.material.side = THREE.DoubleSide;

	THREE.Mesh.call(this, new THREE.PlaneBufferGeometry(1, 1), this.material);

	this.light = light;
}

RectAreaLightHelper.prototype = Object.create(THREE.Mesh.prototype);

RectAreaLightHelper.prototype.update = function()
{
	if(this.light !== null)
	{
		this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);

		this.position.copy(this.light.position);
		this.rotation.copy(this.light.rotation);
		this.scale.set(this.light.width, this.light.height, 1);
	}
};