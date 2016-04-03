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

//Function Prototype
Program.prototype.addScene = addScene;
Program.prototype.removeScene = removeScene;
Program.prototype.addDefaultScene = addDefaultScene;

//Create a default scene with sky
function addDefaultScene()
{
	var scene = new Scene();
	scene.add(new Sky());
	
	var material = new THREE.MeshPhongMaterial();
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var model = new Model3D(geometry, material);
	model.receiveShadow = true;
	model.castShadow = true;
	scene.add(model);

	material = new THREE.MeshPhongMaterial();
	geometry = new THREE.BoxGeometry(10, 0.1, 10);
 	model = new Model3D(geometry, material);
 	model.position.set(0, -0.55, 0);
	model.receiveShadow = true;
	model.castShadow = true;
	scene.add(model);

	this.addScene(scene);

	//If first scene set as actual scene
	if(this.actual_scene == null)
	{
		this.actual_scene = this.scenes[0];
	}
}

//Remove Scene
function removeScene(scene)
{
	var index = this.scenes.indexOf(scene);
	if(index > -1)
	{
		this.scenes.splice(index, 1);
	}

	//If no scene on program set actual scene to null
	if(this.scenes.length === 0)
	{
		this.actual_scene = null;
	}
}

//Add scene
function addScene(scene)
{
	this.scenes.push(scene);
}
