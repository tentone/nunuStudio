function Script()
{
	//Script name
	this.name = "script";
	this.author = "";

	//Script Code
	this.code = 'console.log("Hello World!");';	
}

Script.prototype.run = run;

function run()
{
	eval(this.code);
}