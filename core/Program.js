function Program()
{
	//Activity Information
	this.name = "program";
	this.description = "";
	this.author = "";
	this.version = "0";

	//Screens
	this.scenes = [];

	//Assets list
	this.assets = [];
}

Program.prototype.createScene = createScene;

function createScene()
{
	this.scenes.push(new Scene());
}
