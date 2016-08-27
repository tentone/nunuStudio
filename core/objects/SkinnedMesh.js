"use strict";

//Animated model constructor
function SkinnedMesh(geometry, material, useVertexTexture)
{
	THREE.SkinnedMesh.call(this, geometry, material, useVertexTexture);

	this.name = "model";

	this.receiveShadow = true;
	this.castShadow = true;
}

//Super prototypes
SkinnedMesh.prototype = Object.create(THREE.SkinnedMesh.prototype);

//Dispose model
SkinnedMesh.prototype.dispose = function()
{
	//Dispose material and geometry
	if(this.material.dispose !== undefined)
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