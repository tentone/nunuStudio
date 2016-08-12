"use strict";

//Animated model constructor
function AnimatedModel(geometry, material, useVertexTexture)
{
	THREE.SkinnedMesh.call(this, geometry, material, useVertexTexture);

	this.name = "model";

	this.receiveShadow = true;
	this.castShadow = true;
}

//Function Prototype
AnimatedModel.prototype = Object.create(THREE.SkinnedMesh.prototype);
AnimatedModel.prototype.initialize = initialize;
AnimatedModel.prototype.update = update;
AnimatedModel.prototype.dispose = dispose;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update state
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Dipose model
function dispose()
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