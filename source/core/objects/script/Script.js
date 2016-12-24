function Script(code)
{
	THREE.Object3D.call(this);
	
	this.type = "Script";
	this.name = "script";

	this.script = null;
	this.setCode((code !== undefined) ? code : Script.default);

	this.program = null;
	this.scene = null;
}

Script.prototype = Object.create(THREE.Object3D.prototype);

//Default script code
Script.default = "this.initialize = function()\n{\n	//TODO <INITIALIZATION CODE>\n};\n\nthis.update = function()\n{\n	//TODO <UPDATE CODE>\n};\n\nthis.onMouseOver = function()\n{\n	//TODO <MOUSE OVER CHILDREN CODE>\n};\n\nthis.onResize = function()\n{\n	//TODO <RESIZE CODE>\n};\n\nthis.onExit = function()\n{\n	//TODO <APP EXIT CODE>\n};";

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

	if(this.script.initialize !== undefined)
	{
		this.script.initialize.call(this);
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
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

//Define script code
Script.prototype.setCode = function(code)
{
	try
	{
		this.code = code;
		this.script = new(new Function(this.code))();
	}
	catch(e)
	{
		console.warn("NunuStudio: Error compiling script code");
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