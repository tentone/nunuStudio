function OrthographicCamera(left, right, top, bottom, near, far)//(size, aspect, near, far, mode)
{
	/*this.size = 5;
	this.aspect = 1;
	this.mode = OrthographicCamera.FIXED_VERTICAL;

	if(mode !== undefined)
	{
		this.mode = mode;
	}*/

	THREE.OrthographicCamera.call(this, left, right, top, bottom, near, far);

	this.name = "orthographic_camera";
}

//Function Prototype
OrthographicCamera.prototype = Object.create(THREE.OrthographicCamera.prototype);
OrthographicCamera.prototype.icon = "editor/files/icons/camera/orthographic.png";

OrthographicCamera.prototype.update = update;
OrthographicCamera.prototype.initialize = initialize;

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
