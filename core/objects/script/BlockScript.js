function BlockScript(mode)
{
	THREE.Object3D.call(this);
	
	this.type = "BlockScript";
	this.name = "BlockScript";

	//Program and scene pointers
	this.program = null;
	this.scene = null;

	//BlockScript Code
	this.func = Function("");
	this.mode = BlockScript.INIT;

	//Get arguments
	if(mode !== undefined)
	{
		this.mode = mode;
	}
}

BlockScript.prototype = Object.create(THREE.Object3D.prototype);

//Script execution mode
BlockScript.INIT = 0;
BlockScript.LOOP = 1;

//Initialize
BlockScript.prototype.initialize = function()
{
	//Get program and scene
	var node = this;
	while(node.parent !== null)
	{
		node = node.parent;
		if(node instanceof Scene)
		{
			this.scene = node;
		}
		else if(node instanceof Program)
		{
			this.program = node;
		}
	}

	if(this.mode === BlockScript.INIT)
	{
		this.func();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update script
BlockScript.prototype.update = function()
{
	if(this.mode === BlockScript.LOOP)
	{
		this.func();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Set script execution mode
BlockScript.prototype.setMode = function(mode)
{
	this.mode = mode;
}
