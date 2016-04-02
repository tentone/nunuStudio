function Script()
{
	THREE.Object3D.call(this);

	this.name = "script";
	
	//Script Code
	this.code = '';
	this.func = Function(this.code_loop);
}

//Function Prototype
Script.prototype = Object.create(THREE.Object3D.prototype);
Script.prototype.icon = "editor/files/icons/script/script.png";
Script.prototype.update = update;
Script.prototype.setLoopCode = setLoopCode;

//Set loop code
function setLoopCode(code)
{
	try
	{
		this.code = code;
		this.func = Function(this.code);
	}
	catch(e){}
}

//Update Script
function update()
{
	//Run script
	try
	{
		this.func();
	}
	catch(e){}

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}