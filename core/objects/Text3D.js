function Text3D(geometry, material)
{
	THREE.Mesh.call(this, geometry, material);

	this.name = "model";
}

Text3D.prototype = Object.create(THREE.Mesh.prototype);
Text3D.prototype.icon = "editor/files/icons/models/cube.png";
Text3D.prototype.updateable = true;
Text3D.prototype.update = update;

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
