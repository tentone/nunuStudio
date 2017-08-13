"use strict";

function RectAreaLightHelper(light) 
{
	this.material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});

	THREE.Mesh.call(this, new THREE.PlaneBufferGeometry(1, 1), this.material);

	this.light = light;
	this.update();
}

RectAreaLightHelper.prototype = Object.create(THREE.Mesh.prototype);

RectAreaLightHelper.prototype.update = function()
{
	if(this.light !== null)
	{
		this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);

		this.light.getWorldPosition(this.position);
		this.light.getWorldQuaternion(this.quaternion);

		this.scale.set(this.light.width, this.light.height, 1);
	}
};