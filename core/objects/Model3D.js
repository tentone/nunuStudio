"use strict";

//Model 3D constructor
function Model3D(geometry, material)
{
	THREE.Mesh.call(this, geometry, material);

	this.name = "model";

	this.receiveShadow = true;
	this.castShadow = true;
}

//Function Prototype
Model3D.prototype = Object.create(THREE.Mesh.prototype);
Model3D.prototype.initialize = initialize;
Model3D.prototype.update = update;
Model3D.prototype.dispose = dispose;

//Initialize model
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update model state
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