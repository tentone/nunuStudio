function BlockScript(code, mode)
{
	THREE.Object3D.call(this);
	
	this.type = "BlockScript";
	this.name = "BlockScript";
	
	//Disable auto matrix updates
	this.rotationAutoUpdate = false;

	//Program and scene pointers
	this.program = null;
	this.scene = null;

	//BlockScript Code
	this.func = Function("");
	this.code = "//ADD CODE HERE";
	this.mode = BlockScript.INIT;

	//Get arguments
	if(code !== undefined)
	{
		this.code = code;
	}
	if(mode !== undefined)
	{
		this.mode = mode;
	}
}

//Function Prototype
BlockScript.prototype = Object.create(THREE.Object3D.prototype);
BlockScript.prototype.initialize = initialize;
BlockScript.prototype.update = update;
BlockScript.prototype.setMode = setMode;

//BlockScript mode
BlockScript.INIT = 0;
BlockScript.LOOP = 1;

//Set script mode
function setMode(mode)
{
	this.mode = mode;
}

//Initialize
function initialize()
{
	//Program and scene
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

	//Run script
	if(this.mode === BlockScript.INIT)
	{
		this.func();
	}

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update script
function update()
{
	//Run script
	if(this.mode === BlockScript.LOOP)
	{
		this.func();
	}

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}
