"use strict";

//Perspective camera from fov, aspect ration and near and far planes
function PerspectiveCamera(fov, aspect, near, far)
{
	THREE.PerspectiveCamera.call(this, fov, aspect, near, far);

	this.name = "camera";

	this.rotationAutoUpdate = true;
}

//Function Prototype
PerspectiveCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
PerspectiveCamera.prototype.initialize = initialize;
PerspectiveCamera.prototype.update = update;

//Initialize
function initialize()
{
	this.scale.set(1, 1, 1);
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update State
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}
