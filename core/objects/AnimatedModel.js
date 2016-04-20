function AnimatedModel(geometry, material, useVertexTexture)
{
	THREE.SkinnedMesh.call(this, geometry, material, useVertexTexture);

	this.name = "models";
}

//Function Prototype
AnimatedModel.prototype = Object.create(THREE.SkinnedMesh.prototype);
AnimatedModel.prototype.icon = "editor/files/icons/models/cube.png";

//Runtime functions
AnimatedModel.prototype.update = update;
AnimatedModel.prototype.initialize = initialize;

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
