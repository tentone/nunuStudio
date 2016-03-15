function Script()
{
	this.name = "script";
	this.code = 'console.log("Hello World!");';	
}

Script.prototype.run = run;

function run()
{
	eval(this.code);
}