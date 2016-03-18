function Script()
{
	//Script info
	this.name = "script";
	this.author = "";
	this.version = "";

	//Script parent
	this.parent = null;

	//Script Code
	this.code = 'console.log("Hello World!");';	
}

//Function Prototype
Script.prototype.update = update;

//Update Script (run)
function update()
{
	eval(this.code);
}