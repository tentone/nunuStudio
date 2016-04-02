function PerspectiveCamera(fov, aspect, near, far)
{
	THREE.PerspectiveCamera.call(this, fov, aspect, near, far);
	
	this.name = "prespective_camera";
}

PerspectiveCamera.prototype = Object.create(THREE.PerspectiveCamera.prototype);
PerspectiveCamera.prototype.icon = "editor/files/icons/camera/prespective.png";
PerspectiveCamera.prototype.update = update;

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
