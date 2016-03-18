function Program()
{
	//Program Info
	this.name = "program";
	this.description = "";
	this.author = "";
	this.version = "0";

	//Screens
	this.scenes = [];
}

Program.prototype.createScene = createScene;

function createScene()
{
	var scene = new Scene();
	this.scenes.push();
	return scene;
}
