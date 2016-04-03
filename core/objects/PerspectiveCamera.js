function PerspectiveCamera(fov, aspect, near, far)
{
	THREE.PerspectiveCamera.call(this, fov, aspect, near, far);
	
	this.name = "prespective_camera";
}

//Function Prototype
PerspectiveCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
PerspectiveCamera.prototype.icon = "editor/files/icons/camera/prespective.png";

//Runtime functions
PerspectiveCamera.prototype.update = update;
PerspectiveCamera.prototype.initialize = initialize;

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
