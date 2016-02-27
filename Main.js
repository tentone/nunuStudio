function Main(){}

var scene = null;
var camera = null;
var renderer = null;
var cube = null;

Main.initialize = function(canvas)
{
	//Create camera and scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, canvas.width/canvas.height, 0.1, 100000);

	//Renderer
	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(canvas.width, canvas.height);
	renderer.shadowMap.enabled = false;

	//Add cube to scene
	var material = new THREE.MeshPhongMaterial();
	cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
	cube.position.z = -3;
	scene.add(cube);

	//Create Floor
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	geometry.scale(100,1,100);
	
	var floor = new THREE.Mesh(geometry, material);
	floor.position.y = -1;
	scene.add(floor);
	
	//Add new file handler
	THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

	//Load eyebot model (normal/specular mapped)
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setBaseUrl("data/models/eyebot/");
	mtlLoader.load("data/models/eyebot/eyebot.mtl", function(materials)
	{
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.load("data/models/eyebot/eyebot.obj", function(object)
		{
			object.scale.set(0.03, 0.03, 0.03);
			object.position.set(4, 1, 4);
			scene.add(object);
		});
	});

	//load bane model (multi material obj/mtl)
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.setBaseUrl("data/models/bane/");
	mtlLoader.load("data/models/bane/bane.mtl", function(materials)
	{
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.load("data/models/bane/bane.obj", function(object)
		{
			object.scale.set(0.008, 0.008, 0.008);
			object.position.set(-4, -0.5, 4);
			scene.add(object);
		});
	});

	var loader = new THREE.ColladaLoader();
	loader.setPreferredShading(THREE.SmoothShading);
	loader.load("data/models/cheshirecat/cheshirecat.dae", function(collada)
	{
		collada.scene.scale.set(0.1, 0.1, 0.1);
		scene.add(collada.scene);
	});

	//Light
	var light = new THREE.AmbientLight(0x555555);
	scene.add(light);

	light = new THREE.PointLight(0x330000);
	light.position.set(8, 1, 0);
	scene.add(light);

	light = new THREE.PointLight(0x000033);
	light.position.set(-8, 1, 0);
	scene.add(light);

	light = new THREE.PointLight(0x003300);
	light.position.set(0, 1, -8);
	scene.add(light);
}

Main.update = function()
{
	//Rotate cube
	cube.rotation.x += 0.01;
	
	//Move Camera
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