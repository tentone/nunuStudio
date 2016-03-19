function Program()
{
	//Program Info
	this.name = "program";
	this.description = "";
	this.author = "";
	this.version = "0";

	//Screens
	this.scenes = [];

	//Runtime variables
	this.actual_scene = null;
}

//Function prototypes
Program.prototype.addScene = addScene;

//Add scene to program
function addScene(scene)
{
	this.scenes.push(scene);
}
