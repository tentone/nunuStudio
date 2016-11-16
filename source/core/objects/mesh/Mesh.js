"use strict";

//Model 3D constructor
function Mesh(geometry, material)
{
	THREE.Mesh.call(this, geometry, material);

	this.name = "model";

	this.receiveShadow = true;
	this.castShadow = true;
}

//Super prototype
Mesh.prototype = Object.create(THREE.Mesh.prototype);

//Dispose model
Mesh.prototype.dispose = function()
{
	//Dispose material and geometry
	if(this.material !== null && this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	this.geometry.dispose();

	//Dispose children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}
