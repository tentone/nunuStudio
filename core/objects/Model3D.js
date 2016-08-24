"use strict";

//Model 3D constructor
function Model3D(geometry, material)
{
	THREE.Mesh.call(this, geometry, material);

	this.name = "model";

	this.receiveShadow = true;
	this.castShadow = true;
}

Model3D.prototype = Object.create(THREE.Mesh.prototype);

//Dipose model
Model3D.prototype.dispose = function()
{
	//Dipose material and geometry
	if(this.material.dispose !== undefined)
	{
		this.material.dispose();
	}
	this.geometry.dispose();

	//Dipose children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].dispose();
	}
}