function Bone()
{
	THREE.Bone.call(this);

	this.name = "bone";
}

Bone.prototype = Object.create(THREE.Bone.prototype);

Bone.prototype.update = update;
Bone.prototype.initialize = initialize;

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
