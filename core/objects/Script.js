function Script(code, mode)
{
	THREE.Object3D.call(this);
	
	this.type = "Script";
	this.name = "script";
	
	//Disable auto matrix updates
	this.rotationAutoUpdate = false;

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

//Function Prototype
Script.prototype = Object.create(THREE.Object3D.prototype);
Script.prototype.icon = "editor/files/icons/script/script.png";

//Runtime functions
Script.prototype.initialize = initialize;
Script.prototype.update = update;
Script.prototype.toJSON = toJSON;
Script.prototype.setCode = setCode;
Script.prototype.setMode = setMode;

//Script mode
Script.INIT = 0;
Script.LOOP = 1;

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
	if(this.mode === Script.INIT)
	{
		try
		{
			this.func();
		}
		catch(e){}
	}

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update Script
function update()
{
	//Run script
	if(this.mode === Script.LOOP)
	{
		try
		{
			this.func();
		}
		catch(e){}
	}

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Set initialization code
function setCode(code)
{
	try
	{
		this.code = code;
		this.func = Function(this.code);
	}
	catch(e){}
}

//Set script mode
function setMode(mode)
{
	this.mode = mode;
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.mode = this.mode;
	data.object.code = this.code;

	return data;
}