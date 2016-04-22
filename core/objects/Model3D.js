function Model3D(geometry, material)
{
	THREE.Mesh.call(this, geometry, material);

	this.name = "model";
}

//Function Prototype
Model3D.prototype = Object.create(THREE.Mesh.prototype);
Model3D.prototype.icon = "editor/files/icons/models/cube.png";

//Runtime functions
Model3D.prototype.update = update;
Model3D.prototype.initialize = initialize;

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
