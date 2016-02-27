function Main(){}

var scene = null;
var camera = null;
var renderer = null;
var cube = null;

Main.initialize = function()
{
	//Create camera and scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, canvas.width/canvas.height, 0.1, 100000);

	//Renderer
	renderer = new THREE.WebGLRenderer({ canvas: canvas});
	renderer.setSize(canvas.width, canvas.height);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//Add cube to scene
	var material = new THREE.MeshPhongMaterial();
	cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
	cube.castShadow = true;
	cube.receiveShadow = false;
	cube.position.z = -3;
	scene.add(cube);

	//Create Floor
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	geometry.castShadow = false;
	geometry.receiveShadow = true;
	geometry.scale(100,1,100);
	
	var floor = new THREE.Mesh(geometry, material);
	floor.position.y = -1;
	scene.add(floor);

	var manager = new THREE.LoadingManager();

	//Load eyebot
	var loader = new THREE.OBJLoader();
	loader.load("data/models/eyebot/eyebot.obj", function(object)
	{
		object.scale.set(0.03, 0.03, 0.03);
		object.position.set(4, 0, 4);
		scene.add(object);
	});

	//Light
	light = new THREE.SpotLight(0xff0000);
	light.position.set(8, 1, 0);
	light.castShadow = true;
	scene.add(light);

	light = new THREE.SpotLight(0x0000ff);
	light.position.set(-8, 1, 0);
	light.castShadow = true;
	scene.add(light);

	light = new THREE.SpotLight(0x00ff00);
	light.position.set(0, 1, -8);
	light.castShadow = true;
	scene.add(light);
}

Main.update = function()
{
	//Update stuff
	cube.rotation.x += 0.01;
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		camera.position.z -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		camera.position.z += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		camera.position.x -= 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		camera.position.x += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		camera.position.y += 0.1;
	}
	if(App.keyboard.isKeyPressed(Keyboard.CTRL))
	{
		camera.position.y -= 0.1;
	}
}

//Draw stuff into screen
Main.draw = function()
{
	renderer.render(scene, camera);
}

//Resize to fit window
Main.resize = function(canvas)
{
	renderer.setSize(canvas.width, canvas.height);
	camera.aspect = canvas.width/canvas.height;
	camera.updateProjectionMatrix();
}