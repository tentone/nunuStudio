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

	this.viewport = new THREE.Vector2(1.0, 1.0);

	this.listener = new THREE.AudioListener();
}

PerspectiveCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);

//Initialize camera
PerspectiveCamera.prototype.initialize = function()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Destroy camera
PerspectiveCamera.prototype.destroy = function()
{
	var scene = ObjectUtils.getScene(this);
	if(scene !== null)
	{
		scene.removeCamera(this);
	}
	
	THREE.Object3D.prototype.destroy.call(this);
}

