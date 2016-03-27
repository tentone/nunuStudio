function PerspectiveCamera(fov, aspect, near, far)
{
	THREE.PerspectiveCamera.call(this, fov, aspect, near, far);

	this.updateable = true;
	this.name = "prespective_camera";
	this.icon = "editor/files/icons/camera/prespective.png";
}

PerspectiveCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
PerspectiveCamera.prototype.update = update;

function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].updateable)
		{
			this.children[i].update();
		}
	}
}
