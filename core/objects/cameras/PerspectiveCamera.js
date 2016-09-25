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

	this.offset = new THREE.Vector2(0.0, 0.0);
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

//Create JSON for object
PerspectiveCamera.prototype.toJSON = function(meta)
{
	var data = THREE.PerspectiveCamera.prototype.toJSON.call(this, meta);

	data.object.viewport = this.viewport.toArray();
	data.object.offset = this.offset.toArray();

	return data;
}
