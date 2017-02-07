function Script(code)
{
	THREE.Object3D.call(this);
	
	this.type = "Script";
	this.name = "script";

	this.script = null;
	this.code = (code !== undefined) ? code : Script.default 

	this.program = null;
	this.scene = null;
}

Script.prototype = Object.create(THREE.Object3D.prototype);

//Default script code
Script.default = "this.initialize = function()\n{\n	//TODO <INITIALIZATION CODE>\n};\n\nthis.update = function()\n{\n	//TODO <UPDATE CODE>\n};\n\nthis.onMouseOver = function()\n{\n	//TODO <MOUSE OVER CHILDREN CODE>\n};\n\nthis.onResize = function()\n{\n	//TODO <RESIZE CODE>\n};";//\n\nthis.onExit = function()\n{\n	//TODO <APP EXIT CODE>\n};";

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

	//Compile script
	this.setCode(this.code);	

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}

	//Initialize script
	if(this.script.initialize !== undefined)
	{
		this.script.initialize.call(this);
	}
}

//Update Script
Script.prototype.update = function()
{
	if(this.script.onMouseOver !== undefined)
	{
		var obj = this.scene.raycaster.intersectObjects(this.children, true);
		if(obj.length > 0)
		{
			this.script.onMouseOver.call(this, obj);
		}
	}

	if(this.script.update !== undefined)
	{
		this.script.update.call(this);
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Call resize method if available
Script.prototype.resize = function()
{
	if(this.script.onResize !== undefined)
	{
		this.script.onResize.call(this);
	}
}

//Call onAppData if available
Script.prototype.appData = function(data)
{
	if(this.script.onAppData !== undefined)
	{
		this.script.onAppData.call(this);
	}
}

//Define script code
Script.prototype.setCode = function(code)
{
	if(code !== undefined)
	{
		this.code = code;
	}

	//Compile code and create object
	try
	{
		this.script = new(new Function("Keyboard, Mouse, self, program, scene", this.code))(this.program.keyboard, this.program.mouse, this, this.program, this.scene);
	}
	catch(e)
	{
		console.warn("nunuStudio: Error compiling script code", e);
		this.script = new(function(){})();
	}
}

//Create JSON for object
Script.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.code = this.code;

	return data;
}