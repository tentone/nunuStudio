"use strict";

//Orthographic Camera constructor aspect is in x/y mode
function OrthographicCamera(size, aspect, mode, near, far)
{
	THREE.OrthographicCamera.call(this, -1.0, 1.0, 1.0, -1.0, near, far);

	this.name = "camera";

	this.size = (size != undefined) ? size : 10.0;
	this.aspect = (aspect != undefined) ? aspect : 1.0;
	this.mode = (mode !== undefined) ? mode : OrthographicCamera.RESIZE_HORIZONTAL;

	this.offset = new THREE.Vector2(0.0, 0.0);
	this.viewport = new THREE.Vector2(1.0, 1.0);
	this.clear_color = false;
	this.clear_depth = false;

	this.updateProjectionMatrix();
}

OrthographicCamera.prototype = Object.create(THREE.OrthographicCamera.prototype);

//Scale mode
OrthographicCamera.RESIZE_HORIZONTAL = 0;
OrthographicCamera.RESIZE_VERTICAL = 1;

//Destroy
OrthographicCamera.prototype.destroy = function()
{
	var scene = ObjectUtils.getScene(this);
	if(scene !== null)
	{
		scene.removeCamera(this);
	}
	
	THREE.Object3D.prototype.destroy.call(this);
}

//Update camera projection matrix
OrthographicCamera.prototype.updateProjectionMatrix = function()
{
	//Update left right, top and bottom values from aspect and size
	if(this.mode === OrthographicCamera.RESIZE_HORIZONTAL)
	{
		this.top = this.size / 2;
		this.bottom = -this.top;
		this.right = this.top * this.aspect * (this.viewport.x / this.viewport.y);
		this.left = -this.right;
	}
	else if(this.mode === OrthographicCamera.RESIZE_VERTICAL)
	{
		this.right = this.size / 2;
		this.left = -this.right;
		this.top = this.right / this.aspect * (this.viewport.x / this.viewport.y);
		this.bottom = -this.top;
	}

	THREE.OrthographicCamera.prototype.updateProjectionMatrix.call(this);
}

//Create JSON for object
OrthographicCamera.prototype.toJSON = function(meta)
{
	var data = THREE.OrthographicCamera.prototype.toJSON.call(this, meta);

	data.object.size = this.size;
	data.object.aspect = this.aspect;
	data.object.mode = this.mode;

	data.object.clear_color = this.clear_color;
	data.object.clear_depth = this.clear_depth;
	data.object.viewport = this.viewport.toArray();
	data.object.offset = this.offset.toArray();

	return data;
}
