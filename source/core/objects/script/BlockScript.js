function BlockScript(mode)
{
	THREE.Object3D.call(this);
	
	this.type = "BlockScript";
	this.name = "BlockScript";

	this.script = Function("");

	this.program = null;
	this.scene = null;
}

BlockScript.prototype = Object.create(THREE.Object3D.prototype);

//Initialize
BlockScript.prototype.initialize = function()
{
	//TODO <ADD CODE HERE>

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update script
BlockScript.prototype.update = function()
{
	//TODO <ADD CODE HERE>

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}
