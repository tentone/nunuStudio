//Orthographic Camera constructor aspect is in x/y mode
function OrthographicCamera(size, aspect, mode, near, far)
{
	THREE.OrthographicCamera.call(this, -1, 1, 1, -1, near, far);

	this.name = "orthographic_camera";

	this.size = size;
	this.aspect = aspect;
	this.mode = OrthographicCamera.FIXED_VERTICAL;

	if(mode !== undefined)
	{
		this.mode = mode;
	}

	this.updateProjectionMatrix();
}

//Function Prototype
OrthographicCamera.prototype = Object.create(THREE.OrthographicCamera.prototype);
OrthographicCamera.prototype.icon = "editor/files/icons/camera/orthographic.png";

OrthographicCamera.prototype.update = update;
OrthographicCamera.prototype.initialize = initialize;
OrthographicCamera.prototype.updateProjectionMatrix = updateProjectionMatrix;
OrthographicCamera.prototype.toJSON = toJSON;

//Camera scale mode
OrthographicCamera.FIXED_VERTICAL = 0;
OrthographicCamera.FIXED_HORIZONTAL = 1;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize !== undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update State
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update !== undefined)
		{
			this.children[i].update();
		}
	}
}

//Update camera projection matrix
function updateProjectionMatrix()
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
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.zoom = this.zoom;
	data.object.left = this.left;
	data.object.right = this.right;
	data.object.top = this.top;
	data.object.bottom = this.bottom;
	data.object.near = this.near;
	data.object.far = this.far;

	data.object.size = this.size;
	data.object.aspect = this.aspect;
	data.object.mode = this.mode;

	return data;
}
