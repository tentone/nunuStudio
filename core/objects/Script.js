function Script()
{
	THREE.Object3D.call(this);

	this.name = "script";
	
	//Script Code
	this.code_loop = "";
	this.code_init = "";

	//Script functions
	this.func_loop = Function(this.code_loop);
	this.func_init = Function(this.code_init);
}

//Function Prototype
Script.prototype = Object.create(THREE.Object3D.prototype);
Script.prototype.icon = "editor/files/icons/script/script.png";

//Runtime functions
Script.prototype.initialize = initialize;
Script.prototype.update = update;

//Auxiliar Functions
Script.prototype.setLoopCode = setLoopCode;

//Initialize
function initialize()
{
	//Run script
	try
	{
		this.func_init();
	}
	catch(e){}

	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize != undefined)
		{
			this.children[i].initialize();
		}
	}
}

//Update Script
function update()
{
	//Run script
	try
	{
		this.func_loop();
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

//Set initialization code
function setInitCode(code)
{
	try
	{
		this.code_init = code;
		this.func_init = Function(this.code_init);
	}
	catch(e){}
}

//Set loop code
function setLoopCode(code)
{
	try
	{
		this.code_loop = code;
		this.func_loop = Function(this.code_loop);
	}
	catch(e){}
}