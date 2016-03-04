function Main(){}

//Test objects
var scene = null;
var camera = null;
var camera_rotation = null;
var renderer = null;

//Cannon stuff
var world = null;
var physics_objects = [];
var render_objects = [];

//Object selection
var raycaster = null;

//VR stuff
var vr_manager = null;
var vr_controls = null;

Main.initialize = function(canvas)
{
	//Create camera and scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 100000);
	camera.position.set(0, 5, -5);
	camera_rotation = new THREE.Vector2(0,0);

	//Initialize Leap Hand
	LeapDevice.initialize();
	scene.add(LeapDevice.scene);

	//Init Cannon
	world = new CANNON.World();
	world.broadphase = new CANNON.NaiveBroadphase();
	world.gravity.set(0,-10,0);
	world.solver.tolerance = 0.05;

	//Raycaster
	raycaster = new THREE.Raycaster();

	//Renderer
	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(canvas.width, canvas.height);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

	//Initialize VR manager
	vr_controls = new THREE.VRControls(camera);
	var vr_effect = new THREE.VREffect(renderer);
	vr_effect.setSize(window.innerWidth, window.innerHeight);
	vr_manager = new WebVRManager(renderer, vr_effect, {isUndistorted: false});

	//Create Floor
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	geometry.scale(200,2,200);
	var material = new THREE.MeshPhongMaterial();
	var floor = new THREE.Mesh(geometry, material);
	floor.receiveShadow = true;
	floor.castShadow = true;
	floor.position.y = -1;
	scene.add(floor);

	//Floor plane physics
	var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0});
	body.addShape(plane);
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
	world.addBody(body);

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
			object.position.set(4, 2, 4);
			setShadowReceiving(object, true);
			setShadowCasting(object, true);
			scene.add(object);
		});
	});

	//Load bane model (multi material obj/mtl)
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
			object.position.set(-4, 0, 4);
			setShadowReceiving(object, true);
			setShadowCasting(object, true);
			scene.add(object);
		});
	});

	//Dummy OBJ load test
	var objLoader = new THREE.OBJLoader();
	objLoader.load("data/models/dummy/dummy.obj", function(object)
	{
		object.scale.set(0.01, 0.01, 0.01);
		object.position.set(-4, 0, 0);
		setShadowReceiving(object, true);
		setShadowCasting(object, true);
		scene.add(object);
	});

	//Light
	var light = new THREE.AmbientLight(0x555555);
	scene.add(light);

	light = new THREE.SpotLight(0x330000);
	light.position.set(15, 10, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	scene.add(light);

	light = new THREE.SpotLight(0x000033);
	light.position.set(-15, 10, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;

	scene.add(light);

	light = new THREE.SpotLight(0x003300);
	light.position.set(0, 10, -15);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	scene.add(light);

	//Grid and Axis Helper
	var gridHelper = new THREE.GridHelper(500, 20);
	scene.add(gridHelper);

	var axisHelper = new THREE.AxisHelper(500);
	scene.add(axisHelper);

	//Number of cubes
	var N = 100;

	//Create N  objects for physics and render
	for(var i = 0; i < N; i++)
	{
		var material = new THREE.MeshPhongMaterial({color: Math.floor(Math.random() * 0xffffff)});
		if(Math.random() < 0.5)
		{
			var size = Math.random();
			var shape = new CANNON.Box(new CANNON.Vec3(size, size, size));
			var geometry = new THREE.BoxGeometry(size*2, size*2, size*2, 10, 10);
		}
		else
		{
			var size = Math.random() * 2;
			var shape = new CANNON.Sphere(size);
			var geometry = new THREE.SphereGeometry(size, 16, 16);
		}

		var body = new CANNON.Body({mass:1});
		body.addShape(shape);
		body.position.set(Math.random()*10 - 5, 2.5*i+0.5, Math.random()*10 - 5);
		physics_objects.push(body);
		world.addBody(body);

		var cube = new THREE.Mesh(geometry, material);
		cube.castShadow = true;
		render_objects.push(cube);
		scene.add(cube);
	}
}

Main.update = function()
{
	//Step physics world
	world.step(1/60);

	for(var i = 0; i < render_objects.length; i++)
	{
		render_objects[i].position.set(physics_objects[i].position.x, physics_objects[i].position.y, physics_objects[i].position.z);
		render_objects[i].quaternion.set(physics_objects[i].quaternion.x, physics_objects[i].quaternion.y, physics_objects[i].quaternion.z, physics_objects[i].quaternion.w);
	}

	//Rotate Camera
	if(Keyboard.isKeyPressed(Keyboard.E))
	{
		camera_rotation.x -= 0.02;
	}
	if(Keyboard.isKeyPressed(Keyboard.Q))
	{
		camera_rotation.x += 0.02;
	}

	//Camera Mouse Movement
	camera_rotation.x -= 0.01 * Mouse.SENSITIVITY * Mouse.pos_diff.x;
	camera_rotation.y -= 0.01 * Mouse.SENSITIVITY * Mouse.pos_diff.y;

	//Limit Vertical Rotation to 90 degrees
	var pid2 = 1.57;
	if(camera_rotation.y < -pid2)
	{
		camera_rotation.y = -pid2;
	}
	else if(camera_rotation.y > pid2)
	{
		camera_rotation.y = pid2;
	}
	
	//Calculate direction vector
	var cos_angle_y = Math.cos(camera_rotation.y);
    var direction = new THREE.Vector3(Math.sin(camera_rotation.x)*cos_angle_y, Math.sin(camera_rotation.y), Math.cos(camera_rotation.x)*cos_angle_y);
    
    //Add position offset and set camera direction
    direction.x += camera.position.x;
    direction.y += camera.position.y;
    direction.z += camera.position.z;
    camera.lookAt(direction);
	
	//Update VR headset position and apply to camera
	//vr_controls.update();

	//Move Camera Front and Back
	var speed_walk = 0.2;
	if(Keyboard.isKeyPressed(Keyboard.SHIFT))
	{
		speed_walk = 0.6;
	}
	var angle_cos = Math.cos(camera_rotation.x);
	var angle_sin = Math.sin(camera_rotation.x);
	if(Keyboard.isKeyPressed(Keyboard.S))
	{
		camera.position.z -= speed_walk * angle_cos;
		camera.position.x -= speed_walk * angle_sin;
	}
	if(Keyboard.isKeyPressed(Keyboard.W))
	{
		camera.position.z += speed_walk * angle_cos;
		camera.position.x += speed_walk * angle_sin;
	}

	//Hand Leap Follow Camera
	LeapDevice.scene.rotation.y = Math.PI + camera_rotation.x;
	LeapDevice.scene.position.set(camera.position.x, camera.position.y-2, camera.position.z);
	LeapDevice.scene.position.z += 2 * angle_cos;
	LeapDevice.scene.position.x += 2 * angle_sin;

	//Move Camera Lateral
	var angle_cos = Math.cos(camera_rotation.x + Math.PI/2.0);
	var angle_sin = Math.sin(camera_rotation.x + Math.PI/2.0);
	if(Keyboard.isKeyPressed(Keyboard.A))
	{
		camera.position.z += speed_walk * angle_cos;
		camera.position.x += speed_walk * angle_sin;
	}
	if(Keyboard.isKeyPressed(Keyboard.D))
	{
		camera.position.z -= speed_walk * angle_cos;
		camera.position.x -= speed_walk * angle_sin;
	}

	//Move Camera UP and DOWN
	if(Keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		camera.position.y += 0.1;
	}
	if(Keyboard.isKeyPressed(Keyboard.CTRL))
	{
		camera.position.y -= 0.1;
	}

	//Enable leap hand shadowing
	setShadowReceiving(LeapDevice.scene, true);
	setShadowCasting(LeapDevice.scene, true);

	//Rasycast line from camera and mouse position
	if(Mouse.buttonJustPressed(Mouse.MIDDLE))
	{
		var mouse = new THREE.Vector2((Mouse.pos.x/window.innerWidth )*2 - 1, -(Mouse.pos.y/window.innerHeight)*2 + 1);
		
		//Update the picking ray with the camera and mouse position	
		raycaster.setFromCamera(mouse, camera);	

		var intersects =  raycaster.intersectObjects(scene.children, true);
		if(intersects.length > 0)
		{
			intersects[0].object.material = new THREE.MeshNormalMaterial();
		}

		//Change closeste object material
		/*for(var i = 0; i < intersects.length; i++)
		{
			intersects[i].object.material = new THREE.MeshNormalMaterial();
		}*/
	}

}

//Set shadow receiving
function setShadowReceiving(object, state)
{
	object.receiveShadow = true;

	for(var i = 0; i < object.children.length; i++)
	{
		setShadowReceiving(object.children[i], state);
	}
}

//Enable shadow casting
function setShadowCasting(object, state)
{
	object.castShadow = true;

	for(var i = 0; i < object.children.length; i++)
	{
		setShadowCasting(object.children[i], state);
	}
}

//Draw stuff into screen
Main.draw = function()
{
	vr_manager.render(scene, camera, App.time);
}

//Resize to fit window
Main.resize = function(canvas)
{
	renderer.setSize(canvas.width, canvas.height);
	camera.aspect = canvas.width/canvas.height;
	camera.updateProjectionMatrix();
}