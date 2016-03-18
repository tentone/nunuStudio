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

//Function prototypes
Program.prototype.createScene = createScene;

//Create new Scene
function createScene()
{
	var scene = new Scene();
	this.scenes.push();
	return scene;
}
