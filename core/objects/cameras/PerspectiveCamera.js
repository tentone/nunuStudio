"use strict";

//Perspective camera from fov, aspect ration and near and far planes
function PerspectiveCamera(fov, aspect, near, far)
{
	if(near === undefined)
	{
		near = 0.1;
	}
	if(far === undefined)
	{
		far = 100000;
	}

	THREE.PerspectiveCamera.call(this, fov, aspect, near, far);

	this.name = "camera";
}

PerspectiveCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);

PerspectiveCamera.prototype.initialize = function()
{
	this.getWorldScale(this.scale);
	this.scale.set(1.0 / this.scale.x, 1.0 / this.scale.y, 1.0 / this.scale.z);

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}
