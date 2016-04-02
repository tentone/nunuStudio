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

//Initialize Main
Main.initialize = function()
{
	//Get canvas
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	//Set mouse lock true
	App.setMouseLock(true);
	App.showStats(true);
	
	//Create Main.camera and Main.scene
	Main.scene = new THREE.Scene();
	Main.debug_scene = new THREE.Scene();
	Main.camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 100000);
	Main.camera.position.set(0, 2, -4);
	Main.camera_rotation = new THREE.Vector2(0,0);

	//Init Cannon
	Main.world = new CANNON.World();
	Main.world.broadphase = new CANNON.NaiveBroadphase();
	Main.world.gravity.set(0, -9.8, 0);
	Main.world.solver.iterations = 5;
                
	//Initialize Leap Hand
	LeapHand.initialize();
	LeapHand.physics_world = Main.world;
	Main.scene.add(LeapHand.scene);

	//Raycaster
	Main.raycaster = new THREE.Raycaster();

	//Renderer
	Main.renderer = new THREE.WebGLRenderer({canvas: canvas});
	Main.renderer.autoClear = false;
	Main.renderer.setSize(canvas.width, canvas.height);
	Main.renderer.shadowMap.enabled = true;
	Main.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//VR
	Main.controls = new THREE.VRControls(Main.camera);
	Main.effect = new THREE.VREffect(Main.renderer);
	Main.effect.setSize(canvas.width, canvas.height);
	Main.manager = new WebVRManager(Main.renderer, Main.effect);

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
    var groundMaterial = new CANNON.Material();
	var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0, material: groundMaterial});
	body.addShape(plane);
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
	Main.world.addBody(body);

	var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0, material: groundMaterial});
	body.addShape(plane);
	body.position.x = 10;
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -Math.PI/2);
	Main.world.addBody(body);

	var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0, material: groundMaterial});
	body.addShape(plane);
	body.position.x = -10;
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI/2);
	Main.world.addBody(body);

	var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0, material: groundMaterial});
	body.addShape(plane);
	body.position.z = -10;
	Main.world.addBody(body);

	var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0, material: groundMaterial});
	body.addShape(plane);
	body.position.z = 10;
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI);
	Main.world.addBody(body);

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
	var light = new THREE.AmbientLight(0xaaaaaa);
	Main.scene.add(light);

	light = new THREE.SpotLight(0x333333);
	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;
	light.position.set(15, 10, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	Main.scene.add(light);

	light = new THREE.SpotLight(0x333333);
	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;
	light.position.set(-15, 10, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	Main.scene.add(light);

	light = new THREE.SpotLight(0x333333);
	light.shadowMapWidth = 2048;
	light.shadowMapHeight = 2048;
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
    var mat = new CANNON.Material();

	//Create N  objects for physics and render
	for(var i = 0; i < N; i++)
	{
		var material = new THREE.MeshPhongMaterial({color: Math.floor(Math.random() * 0xffffff)});
		var size = Math.random() * 0.3 + 0.5;
		var shape = new CANNON.Sphere(size);
		var geometry = new THREE.SphereGeometry(size, 16, 16);

		var body = new CANNON.Body({mass:0.1, linearDamping:0.1, angularDamping:0.1, material: mat});
		body.addShape(shape);
		body.position.set(Math.random()*5 - 5, i + 0.5, Math.random()*5 - 5);
		Main.physics_objects.push(body);
		Main.world.addBody(body);

		var cube = new THREE.Mesh(geometry, material);
		cube.castShadow = true;
		Main.render_objects.push(cube);
		Main.scene.add(cube);
	}
    
    // contact behavior
    var mat_ground = new CANNON.ContactMaterial(groundMaterial, mat, { friction: 0.3, restitution: 0.3 });
    var mat_ground = new CANNON.ContactMaterial(mat, mat, { friction: 0.5, restitution: 0.3 });
    Main.world.addContactMaterial(mat_ground);
}

Main.update = function()
{
	//Step physics Main.world
	Main.world.step(1/60);

	Main.render_objects.forEach(function(obj, i)
	{
		Main.render_objects[i].position.set(Main.physics_objects[i].position.x, Main.physics_objects[i].position.y, Main.physics_objects[i].position.z);
		Main.render_objects[i].quaternion.set(Main.physics_objects[i].quaternion.x, Main.physics_objects[i].quaternion.y, Main.physics_objects[i].quaternion.z, Main.physics_objects[i].quaternion.w);
	});

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
	LeapHand.scene.rotation.y = Math.PI + Main.camera_rotation.x;
	LeapHand.scene.position.set(Main.camera.position.x, Main.camera.position.y-2, Main.camera.position.z);
	LeapHand.scene.position.z += 2 * angle_cos;
	LeapHand.scene.position.x += 2 * angle_sin;
	
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
	setShadowReceiving(LeapHand.scene, true);
	setShadowCasting(LeapHand.scene, true);

	//Rasycast line from Main.camera and mouse position
	if(Mouse.buttonJustPressed(Mouse.MIDDLE))
	{
		var mouse = new THREE.Vector2((Mouse.pos.x/window.innerWidth)*2 - 1, -(Mouse.pos.y/window.innerHeight)*2 + 1);
		
		//Update the picking ray with the Main.camera and mouse position	
		Main.raycaster.setFromCamera(mouse, Main.camera);	

		var intersects =  Main.raycaster.intersectObjects(Main.scene.children, true);
		if(intersects.length > 0)
		{
			intersects[0].object.material = new THREE.MeshNormalMaterial();
		}
	}

}

//Add physics bounding box from objet to physics world
function addPhysicsBoundingBox(object, world)
{
	for(var j = 0; j < object.children.length; j++)
	{
		var box = new THREE.BoundingBoxHelper(object.children[j]);
		box.update();

		var hs = new THREE.Vector3(box.box.max.x - box.box.min.x, box.box.max.y - box.box.min.y, box.box.max.z - box.box.min.z);
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
	//Main.manager.render(Main.scene, Main.camera, 1/60);
	Main.renderer.render(Main.scene, Main.camera);
}


//Resize to fit window
Main.resize = function()
{
	var canvas = document.getElementById("canvas");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	Main.renderer.setSize(canvas.width, canvas.height);
	Main.effect.setSize(canvas.width, canvas.height);

	Main.camera.aspect = canvas.width/canvas.height;
	Main.camera.updateProjectionMatrix();
}