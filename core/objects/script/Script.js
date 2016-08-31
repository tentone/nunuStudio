function Script(code, mode)
{
	THREE.Object3D.call(this);
	
	this.type = "Script";
	this.name = "script";

	//Program and scene pointers
	this.program = null;
	this.scene = null;

	//Script Code
	this.func = null;
	this.code = "//ADD CODE HERE";
	this.mode = Script.INIT;

	//Get arguments
	if(code !== undefined)
	{
		this.code = code;
	}
	if(mode !== undefined)
	{
		this.mode = mode;
	}

	//Script functions
	this.setCode(this.code);
}

Script.prototype = Object.create(THREE.Object3D.prototype);

//Script execution mode
Script.INIT = 0;
Script.LOOP = 1;

//Initialize
Script.prototype.initialize = function()
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

	if(this.mode === Script.INIT)
	{
		this.func();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update Script
Script.prototype.update = function()
{
	if(this.mode === Script.LOOP)
	{
		this.func();
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Define script code
Script.prototype.setCode = function(code)
{
	try
	{
		this.code = code;
		this.func = Function(this.code);
	}
	catch(e){}
}

//Set script execution mode
Script.prototype.setMode = function(mode)
{
	this.mode = mode;
}

//Create JSON for object
Script.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.mode = this.mode;
	data.object.code = this.code;

	return data;
}