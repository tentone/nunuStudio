include("editor/ui/Button.js");
include("editor/ui/DropdownMenu.js");
include("editor/ui/Text.js");
include("editor/ui/Division.js");
include("editor/ui/Image.js");
include("editor/ui/DivisionResizable.js");
include("editor/ui/ButtonImage.js");
include("editor/ui/ButtonDrawer.js");
include("editor/ui/Style.js");

include("editor/EditorUI.js");

//Editor declaration
function Editor(){}

//Test objects
Editor.scene = null;
Editor.debug_scene = null;
Editor.camera = null;
Editor.camera_rotation = null;
Editor.renderer = null;

//Cannon stuff
Editor.world = null;
Editor.physics_objects = [];
Editor.render_objects = [];
Editor.cannon_renderer = null;

//Object selection
Editor.raycaster = null;

//Initialize Main
Editor.initialize = function(canvas)
{
	//Set mouse lock true
	App.setMouseLock(false);
	App.showStats(false);
	
	Editor.canvas = canvas;

	//Create camera and scene
	Editor.scene = new THREE.Scene();
	Editor.debug_scene = new THREE.Scene();
	Editor.camera = new THREE.PerspectiveCamera(75, canvas.width/canvas.height, 0.1, 100000);
	Editor.camera.position.set(0, 5, -5);
	Editor.camera_rotation = new THREE.Vector2(0,0);

	//Init Cannon
	Editor.world = new CANNON.World();
	Editor.world.broadphase = new CANNON.NaiveBroadphase();
	Editor.world.gravity.set(0,-10,0);
	Editor.world.solver.tolerance = 0.05;

	Editor.cannon_renderer = new THREE.CannonDebugRenderer(Editor.debug_scene, Editor.world);

	//Initialize Leap Hand
	LeapDevice.initialize();
	Editor.scene.add(LeapDevice.scene);

	//Raycaster
	Editor.raycaster = new THREE.Raycaster();

	//Renderer
	Editor.renderer = new THREE.WebGLRenderer({canvas: canvas});
	Editor.renderer.autoClear = false;
	Editor.renderer.setSize(canvas.width, canvas.height);
	Editor.renderer.shadowMap.enabled = true;
	Editor.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//Create Floor
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	geometry.scale(200,2,200);
	var material = new THREE.MeshPhongMaterial();
	var floor = new THREE.Mesh(geometry, material);
	floor.receiveShadow = true;
	floor.castShadow = true;
	floor.position.y = -1;
	Editor.scene.add(floor);

	//Floor plane physics
	var plane = new CANNON.Plane();
	var body = new CANNON.Body({mass:0});
	body.addShape(plane);
	body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
	Editor.world.addBody(body);

	//Light
	var light = new THREE.AmbientLight(0x555555);
	Editor.scene.add(light);

	light = new THREE.SpotLight(0x330000);
	light.position.set(15, 10, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	Editor.scene.add(light);

	light = new THREE.SpotLight(0x000033);
	light.position.set(-15, 10, 0);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;

	Editor.scene.add(light);

	light = new THREE.SpotLight(0x003300);
	light.position.set(0, 10, -15);
	light.target.position.set(0, 0, 0);
	light.castShadow = true;
	Editor.scene.add(light);

	//Grid and Axis Helper
	var gridHelper = new THREE.GridHelper(500, 20);
	Editor.debug_scene.add(gridHelper);

	var axisHelper = new THREE.AxisHelper(500);
	Editor.debug_scene.add(axisHelper);

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
		Editor.physics_objects.push(body);
		Editor.world.addBody(body);

		var cube = new THREE.Mesh(geometry, material);
		cube.castShadow = true;
		Editor.render_objects.push(cube);
		Editor.scene.add(cube);
	}

	//Initialize User Interface
	EditorUI.initialize();
}

Editor.update = function()
{
	EditorUI.update();
	
	//Step physics Editor.world
	Editor.world.step(1/60);

	for(var i = 0; i < Editor.render_objects.length; i++)
	{
		Editor.render_objects[i].position.set(Editor.physics_objects[i].position.x, Editor.physics_objects[i].position.y, Editor.physics_objects[i].position.z);
		Editor.render_objects[i].quaternion.set(Editor.physics_objects[i].quaternion.x, Editor.physics_objects[i].quaternion.y, Editor.physics_objects[i].quaternion.z, Editor.physics_objects[i].quaternion.w);
	}

	//Rotate Camera
	if(Keyboard.isKeyPressed(Keyboard.E))
	{
		Editor.camera_rotation.x -= 0.02;
	}
	if(Keyboard.isKeyPressed(Keyboard.Q))
	{
		Editor.camera_rotation.x += 0.02;
	}

	//Camera Mouse Movement
	if(Mouse.buttonPressed(Mouse.LEFT))
	{
		Editor.camera_rotation.x -= 0.01 * Mouse.SENSITIVITY * Mouse.pos_diff.x;
		Editor.camera_rotation.y -= 0.01 * Mouse.SENSITIVITY * Mouse.pos_diff.y;

		//Limit Vertical Rotation to 90 degrees
		var pid2 = 1.57;
		if(Editor.camera_rotation.y < -pid2)
		{
			Editor.camera_rotation.y = -pid2;
		}
		else if(Editor.camera_rotation.y > pid2)
		{
			Editor.camera_rotation.y = pid2;
		}
	}
	
	//Calculate direction vector
	var cos_angle_y = Math.cos(Editor.camera_rotation.y);
    var direction = new THREE.Vector3(Math.sin(Editor.camera_rotation.x)*cos_angle_y, Math.sin(Editor.camera_rotation.y), Math.cos(Editor.camera_rotation.x)*cos_angle_y);
    
    //Add position offset and set Editor.camera direction
    direction.x += Editor.camera.position.x;
    direction.y += Editor.camera.position.y;
    direction.z += Editor.camera.position.z;
    Editor.camera.lookAt(direction);

	//Move Camera Front and Back
	var speed_walk = 0.2;
	if(Keyboard.isKeyPressed(Keyboard.SHIFT))
	{
		speed_walk = 0.6;
	}
	var angle_cos = Math.cos(Editor.camera_rotation.x);
	var angle_sin = Math.sin(Editor.camera_rotation.x);
	if(Keyboard.isKeyPressed(Keyboard.S))
	{
		Editor.camera.position.z -= speed_walk * angle_cos;
		Editor.camera.position.x -= speed_walk * angle_sin;
	}
	if(Keyboard.isKeyPressed(Keyboard.W))
	{
		Editor.camera.position.z += speed_walk * angle_cos;
		Editor.camera.position.x += speed_walk * angle_sin;
	}

	//Hand Leap Follow Camera
	LeapDevice.scene.rotation.y = Math.PI + Editor.camera_rotation.x;
	LeapDevice.scene.position.set(Editor.camera.position.x, Editor.camera.position.y-2, Editor.camera.position.z);
	LeapDevice.scene.position.z += 2 * angle_cos;
	LeapDevice.scene.position.x += 2 * angle_sin;
	
	//Move Camera Lateral
	var angle_cos = Math.cos(Editor.camera_rotation.x + Math.PI/2.0);
	var angle_sin = Math.sin(Editor.camera_rotation.x + Math.PI/2.0);
	if(Keyboard.isKeyPressed(Keyboard.A))
	{
		Editor.camera.position.z += speed_walk * angle_cos;
		Editor.camera.position.x += speed_walk * angle_sin;
	}
	if(Keyboard.isKeyPressed(Keyboard.D))
	{
		Editor.camera.position.z -= speed_walk * angle_cos;
		Editor.camera.position.x -= speed_walk * angle_sin;
	}

	//Move Camera UP and DOWN
	if(Keyboard.isKeyPressed(Keyboard.SPACEBAR))
	{
		Editor.camera.position.y += 0.1;
	}
	if(Keyboard.isKeyPressed(Keyboard.CTRL))
	{
		Editor.camera.position.y -= 0.1;
	}

	//Enable leap hand shadowing
	setShadowReceiving(LeapDevice.scene, true);
	setShadowCasting(LeapDevice.scene, true);

	//Rasycast line from Editor.camera and mouse position
	if(Mouse.buttonJustPressed(Mouse.RIGHT))
	{
		var mouse = new THREE.Vector2((Mouse.pos.x/Editor.canvas.width )*2 - 1, -(Mouse.pos.y/Editor.canvas.height)*2 + 1);
		
		//Update the picking ray with the Editor.camera and mouse position	
		Editor.raycaster.setFromCamera(mouse, Editor.camera);	

		var intersects =  Editor.raycaster.intersectObjects(Editor.scene.children, true);
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
Editor.draw = function()
{
	Editor.cannon_renderer.update();
	Editor.renderer.render(Editor.debug_scene, Editor.camera);
	Editor.renderer.render(Editor.scene, Editor.camera);
}

//Resize to fit window
Editor.resize = function(canvas)
{
	EditorUI.updateInterface();
	Editor.resizeCamera(canvas);
}


//Resize Camera
Editor.resizeCamera = function(canvas)
{
	Editor.canvas = canvas;
	Editor.renderer.setSize(canvas.width, canvas.height);
	Editor.camera.aspect = canvas.width/canvas.height;
	Editor.camera.updateProjectionMatrix();
}