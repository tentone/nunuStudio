function AnimatedModel(geometry, material, useVertexTexture)
{
	THREE.SkinnedMesh.call(this, geometry, material, useVertexTexture);

	this.name = "model";
}

//Function Prototype
AnimatedModel.prototype = Object.create(THREE.SkinnedMesh.prototype);

//Runtime functions
AnimatedModel.prototype.update = update;
AnimatedModel.prototype.initialize = initialize;

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
