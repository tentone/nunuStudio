function Model3D(geometry, material)
{
	THREE.Mesh.call(this, geometry, material);
}

Model3D.prototype = Object.create(THREE.Mesh.prototype);
Model3D.prototype.update = update;

function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}