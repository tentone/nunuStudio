"use strict";

//Orthographic Camera constructor aspect is in x/y mode
function OrthographicCamera(size, aspect, mode, near, far)
{
	if(near === undefined)
	{
		near = 0;
	}
	if(far === undefined)
	{
		far = 100000;
	}

	THREE.OrthographicCamera.call(this, -1.0, 1.0, 1.0, -1.0, near, far);

	this.name = "camera";

	this.size = size;
	this.aspect = aspect;
	this.mode = (mode !== undefined) ? mode : OrthographicCamera.FIXED_VERTICAL;
}

OrthographicCamera.prototype = Object.create(THREE.OrthographicCamera.prototype);

//Camera scale mode
OrthographicCamera.FIXED_VERTICAL = 0;
OrthographicCamera.FIXED_HORIZONTAL = 1;

//Initialize
OrthographicCamera.prototype.initialize = function()
{
	this.getWorldScale(this.scale);
	this.scale.set(1.0 / this.scale.x, 1.0 / this.scale.y, 1.0 / this.scale.z);
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update camera projection matrix
OrthographicCamera.prototype.updateProjectionMatrix = function()
{
	//Update left right, top and bottom values from aspect and size
	if(this.mode === OrthographicCamera.FIXED_VERTICAL)
	{
		this.top = this.size/2;
		this.bottom = -this.top;
		this.right = this.top * this.aspect;
		this.left = -this.right;
	}
	else if(this.mode === OrthographicCamera.FIXED_HORIZONTAL)
	{
		this.right = this.size/2;
		this.left = -this.right;
		this.top = this.right / this.aspect;
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

	return data;
}
