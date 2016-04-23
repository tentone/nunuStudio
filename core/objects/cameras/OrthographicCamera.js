function OrthographicCamera(left, right, top, bottom, near, far)
{
	THREE.OrthographicCamera.call(this, left, right, top, bottom, near, far);

	this.name = "orthographic_camera";

	this.rotationAutoUpdate = true;
}

//Function Prototype
OrthographicCamera.prototype = Object.create(THREE.OrthographicCamera.prototype);
OrthographicCamera.prototype.icon = "editor/files/icons/camera/orthographic.png";

//Runtime functions
OrthographicCamera.prototype.update = update;
OrthographicCamera.prototype.initialize = initialize;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize != undefined)
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
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}
