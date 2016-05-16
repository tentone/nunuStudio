function PerspectiveCamera(fov, aspect, near, far)
{
	THREE.PerspectiveCamera.call(this, fov, aspect, near, far);

	this.name = "prespective_camera";

	this.rotationAutoUpdate = true;
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
