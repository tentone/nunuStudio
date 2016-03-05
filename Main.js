function Main(){}

//Test objects
Main.scene = null;
Main.debug_scene = null;
Main.camera = null;
Main.camera_rotation = null;
Main.renderer = null;

//Cannon stuff
Main.world = null;
Main.physics_objects = [];
Main.render_objects = [];
Main.cannon_renderer = null;

//Object selection
Main.raycaster = null;

//VR stuff
Main.vr_manager = null;
Main.vr_controls = null;
Main.vr_effect = null;

//Initialize Main
Main.initialize = function(canvas)
{
	//Set mouse lock true
	App.setMouseLock(true);
	App.showStats(false);
	
	//Create Main.camera and Main.scene
	Main.scene = new THREE.Scene();
	Main.debug_scene = new THREE.Scene();
	Main.camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 100000);
	Main.camera.position.set(0, 5, -5);
	Main.camera_rotation = new THREE.Vector2(0,0);

	//Init Cannon
	Main.world = new CANNON.World();
	Main.world.broadphase = new CANNON.NaiveBroadphase();
	Main.world.gravity.set(0,-10,0);
	Main.world.solver.tolerance = 0.05;

	Main.cannon_renderer = new THREE.CannonDebugRenderer(Main.debug_scene, Main.world);

	//Initialize Leap Hand
	LeapDevice.initialize();
	Main.scene.add(LeapDevice.scene);

	//Raycaster
	Main.raycaster = new THREE.Raycaster();

	//Renderer
	Main.renderer = new THREE.WebGLRenderer({canvas: canvas});
	Main.renderer.autoClear = false;
	Main.renderer.setSize(canvas.width, canvas.height);
	Main.renderer.shadowMap.enabled = true;
	Main.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

	//Initialize VR manager
	Main.vr_controls = new THREE.VRControls(Main.camera);
	Main.vr_effect = new THREE.VREffect(Main.renderer);
	Main.vr_effect.setSize(window.innerWidth, window.innerHeight);
	Main.vr_manager = new WebVRManager(Main.renderer, Main.vr_effect, {isUndistorted: false});

	//Create Floor
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	geometry.scale(200,2,200);
	var material = new THREE.MeshPhongMaterial();
	var floor = new THREE.Mesh(geometry, material);
	floor.receiveShadow = true;
	floor.castShadow = true;
	floor.position.y = -1;
	Main.scene.add(floor);

	//Floor plane physics
	var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0});
	body.addShape(plane);
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
	Main.world.addBody(body);

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

			addPhysicsBoundingBox(object, Main.world);
			Main.scene.add(object);
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

			addPhysicsBoundingBox(object, Main.world);
			Main.scene.add(object);
		});
	});

	//Dummy OBJ load test
	var objLoader = new THREE.OBJLoader();
	objLoader.load("data/models/dummy/dummy.obj", function(object)
	{
		var scale = 0.01;
		object.scale.set(scale, scale, scale);
		object.position.set(-4, 0, 0);
		setShadowReceiving(object, true);
		setShadowCasting(object, true);

		addPhysicsBoundingBox(object, Main.world);
		Main.scene.add(object);
	});

	//Light
	var light = new THREE.AmbientLight(0x555555);
	Main.scene.add(light);

	light = new THREE.SpotLight(0x330000);
	light.position.set(15, 10, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	Main.scene.add(light);

	light = new THREE.SpotLight(0x000033);
	light.position.set(-15, 10, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;

	Main.scene.add(light);

	light = new THREE.SpotLight(0x003300);
	light.position.set(0, 10, -15);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	Main.scene.add(light);

	//Grid and Axis Helper
	var gridHelper = new THREE.GridHelper(500, 20);
	Main.debug_scene.add(gridHelper);

	var axisHelper = new THREE.AxisHelper(500);
	Main.debug_scene.add(axisHelper);

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

		var body = new CANNON.Body({mass:1, linearDamping:0.1, angularDamping:0.1});
		body.addShape(shape);
		body.position.set(Math.random()*10 - 5, 2.5*i+0.5, Math.random()*10 - 5);
		Main.physics_objects.push(body);
		Main.world.addBody(body);

		var cube = new THREE.Mesh(geometry, material);
		cube.castShadow = true;
		Main.render_objects.push(cube);
		Main.scene.add(cube);
	}
}

Main.update = function()
{
	//Step physics Main.world
	Main.world.step(1/60);

	for(var i = 0; i < Main.render_objects.length; i++)
	{
		Main.render_objects[i].position.set(Main.physics_objects[i].position.x, Main.physics_objects[i].position.y, Main.physics_objects[i].position.z);
		Main.render_objects[i].quaternion.set(Main.physics_objects[i].quaternion.x, Main.physics_objects[i].quaternion.y, Main.physics_objects[i].quaternion.z, Main.physics_objects[i].quaternion.w);
	}

	//Rotate Camera
	if(Keyboard.isKeyPressed(Keyboard.E))
	{
		Main.camera_rotation.x -= 0.02;
	}
	if(Keyboard.isKeyPressed(Keyboard.Q))
	{
		Main.camera_rotation.x += 0.02;
	}

	//Camera Mouse Movement
	Main.camera_rotation.x -= 0.01 * Mouse.SENSITIVITY * Mouse.pos_diff.x;
	Main.camera_rotation.y -= 0.01 * Mouse.SENSITIVITY * Mouse.pos_diff.y;

	//Limit Vertical Rotation to 90 degrees
	var pid2 = 1.57;
	if(Main.camera_rotation.y < -pid2)
	{
		Main.camera_rotation.y = -pid2;
	}
	else if(Main.camera_rotation.y > pid2)
	{
		Main.camera_rotation.y = pid2;
	}
	
	//Calculate direction vector
	var cos_angle_y = Math.cos(Main.camera_rotation.y);
    var direction = new THREE.Vector3(Math.sin(Main.camera_rotation.x)*cos_angle_y, Math.sin(Main.camera_rotation.y), Math.cos(Main.camera_rotation.x)*cos_angle_y);
    
    //Add position offset and set Main.camera direction
    direction.x += Main.camera.position.x;
    direction.y += Main.camera.position.y;
    direction.z += Main.camera.position.z;
    Main.camera.lookAt(direction);
	
	//Update VR headset position and apply to Main.camera
	//Main.vr_controls.update();

	//Move Camera Front and Back
	var speed_walk = 0.2;
	if(Keyboard.isKeyPressed(Keyboard.SHIFT))
	{
		speed_walk = 0.6;
	}
	var angle_cos = Math.cos(Main.camera_rotation.x);
	var angle_sin = Math.sin(Main.camera_rotation.x);
	if(Keyboard.isKeyPressed(Keyboard.S))
	{
		Main.camera.position.z -= speed_walk * angle_cos;
		Main.camera.position.x -= speed_walk * angle_sin;
	}
	if(Keyboard.isKeyPressed(Keyboard.W))
	{
		Main.camera.position.z += speed_walk * angle_cos;
		Main.camera.position.x += speed_walk * angle_sin;
	}

	//Hand Leap Follow Camera
	LeapDevice.scene.rotation.y = Math.PI + Main.camera_rotation.x;
	LeapDevice.scene.position.set(Main.camera.position.x, Main.camera.position.y-2, Main.camera.position.z);
	LeapDevice.scene.position.z += 2 * angle_cos;
	LeapDevice.scene.position.x += 2 * angle_sin;
	
	//Move Camera Lateral
	var angle_cos = Math.cos(Main.camera_rotation.x + Math.PI/2.0);
	var angle_sin = Math.sin(Main.camera_rotation.x + Math.PI/2.0);
	if(Keyboard.isKeyPressed(Keyboard.A))
	{
		Main.camera.position.z += speed_walk * angle_cos;
		Main.camera.position.x += speed_walk * angle_sin;
	}
	if(Keyboard.isKeyPressed(Keyboard.D))
	{
		Main.camera.position.z -= speed_walk * angle_cos;
		Main.camera.position.x -= speed_walk * angle_sin;
	}

	//Move Camera UP and DOWN
	if(Keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		Main.camera.position.y += 0.1;
	}
	if(Keyboard.isKeyPressed(Keyboard.CTRL))
	{
		Main.camera.position.y -= 0.1;
	}

	//Enable leap hand shadowing
	setShadowReceiving(LeapDevice.scene, true);
	setShadowCasting(LeapDevice.scene, true);

	//Rasycast line from Main.camera and mouse position
	if(Mouse.buttonJustPressed(Mouse.MIDDLE))
	{
		var mouse = new THREE.Vector2((Mouse.pos.x/window.innerWidth )*2 - 1, -(Mouse.pos.y/window.innerHeight)*2 + 1);
		
		//Update the picking ray with the Main.camera and mouse position	
		Main.raycaster.setFromCamera(mouse, Main.camera);	

		var intersects =  Main.raycaster.intersectObjects(Main.scene.children, true);
		if(intersects.length > 0)
		{
			intersects[0].object.material = new THREE.MeshNormalMaterial();
		}

		//Change closest object material
		/*for(var i = 0; i < intersects.length; i++)
		{
			intersects[i].object.material = new THREE.MeshNormalMaterial();
		}*/
	}

}

//Add physics bounding box from objet to physics world
function addPhysicsBoundingBox(object, world)
{
	for(var j = 0; j < object.children.length; j++)
	{
		var box = new THREE.BoundingBoxHelper(object.children[j]);
		box.update();

		var hs = new THREE.Vector3(box.box.max.x - box.box.min.x, box.box.max.y - box.box.min.y, box.box.max.y - box.box.min.z);
		hs.x *= object.scale.x;
		hs.y *= object.scale.y;
		hs.z *= object.scale.z;
		hs.divideScalar(2);

		var pos = box.box.center();
		pos.x *= object.scale.x;
		pos.y *= object.scale.y;
		pos.z *= object.scale.z;
		pos.add(object.position);

		var shape = new CANNON.Box(new CANNON.Vec3(hs.x, hs.y, hs.z));
		var body = new CANNON.Body({mass:0});
		body.addShape(shape);
		body.quaternion.setFromEuler(0,Math.PI/2,0,"XYZ");
		body.position.set(pos.x, pos.y, pos.z);
		body.updateMassProperties();

		world.addBody(body);
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
	Main.cannon_renderer.update();
	Main.vr_manager.render(Main.debug_scene, Main.camera, App.time);
	Main.vr_manager.render(Main.scene, Main.camera, App.time);
}


//Resize to fit window
Main.resize = function(canvas)
{
	Main.renderer.setSize(canvas.width, canvas.height);
	Main.camera.aspect = canvas.width/canvas.height;
	Main.camera.updateProjectionMatrix();
}