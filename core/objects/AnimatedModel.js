"use strict";

//Animated model constructor
function AnimatedModel(geometry, material, useVertexTexture)
{
	THREE.SkinnedMesh.call(this, geometry, material, useVertexTexture);

	this.name = "model";

	this.receiveShadow = true;
	this.castShadow = true;
}

AnimatedModel.prototype = Object.create(THREE.SkinnedMesh.prototype);

//Initialize
AnimatedModel.prototype.initialize = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update state
AnimatedModel.prototype.update = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Dipose model
AnimatedModel.prototype.dispose = function()
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