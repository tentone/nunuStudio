function Main(){}

var scene = null;
var camera = null;
var camera_rotation = null;
var renderer = null;
var cube = null;

//Leap Hand Variables
var baseBoneRotation;
var armMeshes;
var boneMeshes;

Main.initialize = function(canvas)
{
	//Create camera and scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, canvas.width/canvas.height, 0.1, 100000);
	camera_rotation = new THREE.Vector2(0,0);

	//Renderer
	renderer = new THREE.WebGLRenderer({canvas: canvas});
	renderer.setSize(canvas.width, canvas.height);
	renderer.shadowMap.enabled = true;

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

	//Grid and Axis Helper
	var gridHelper = new THREE.GridHelper(500, 10);
	scene.add(gridHelper);

	var axisHelper = new THREE.AxisHelper(500);
	scene.add(axisHelper);

	//Leap Integration
	baseBoneRotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
	armMeshes = [];
	boneMeshes = [];

	//Start leap and set callback function
	Leap.loop({background: true}, updateLeap).connect();
}

//Update leap status
function updateLeap(frame)
{
	var countBones = 0;
	var countArms = 0;

	armMeshes.forEach(function(item)
	{
		scene.remove(item)
	});
	
	boneMeshes.forEach(function(item)
	{
		scene.remove(item)
	});

	for(var hand of frame.hands)
	{
		for(var finger of hand.fingers)
		{
			for(var bone of finger.bones) 
			{
				if(countBones++ === 0)
				{
					continue;
				}
				var boneMesh = boneMeshes[countBones] || addMesh(boneMeshes);
				updateMesh(bone, boneMesh);
			}
		}

		var arm = hand.am;
		if(arm != undefined)
		{
			var armMesh = armMeshes[countArms++] || addMesh(armMeshes);
			updateMesh(arm, armMesh);
			armMesh.scale.set(arm.width/4, arm.width/2, arm.length);
		}
	}
}

function addMesh(meshes)
{
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshNormalMaterial();
	var mesh = new THREE.Mesh(geometry, material);
	meshes.push(mesh);
	return mesh;
}

function updateMesh(bone, mesh)
{
	mesh.position.fromArray(bone.center());
	mesh.position.x /= 150;
	mesh.position.y /= 150;
	mesh.position.z /= 150;
	
	mesh.setRotationFromMatrix((new THREE.Matrix4).fromArray(bone.matrix()));
	mesh.quaternion.multiply(baseBoneRotation);
	mesh.scale.set(bone.width/150, bone.width/150, bone.length/150);
	scene.add(mesh);
}

Main.update = function()
{
	//Rotate cube
	cube.rotation.x += 0.01;

	//Rotate Camera
	if(App.keyboard.isKeyPressed(Keyboard.E))
	{
		camera_rotation.x -= 0.02;
	}
	if(App.keyboard.isKeyPressed(Keyboard.Q))
	{
		camera_rotation.x += 0.02;
	}
	
	//Camera Mouse Movement
	camera_rotation.x -= 0.01 * Mouse.SENSITIVITY * App.mouse.pos_diff.x;
	camera_rotation.y -= 0.01 * Mouse.SENSITIVITY * App.mouse.pos_diff.y;

	//Limit Vertical Rotation to 90 degrees
	var pid2 = 1.57079;
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
	
	//Move Camera with WASD
	var speed_walk = 0.2;
	var angle_cos = Math.cos(camera_rotation.x);
	var angle_sin = Math.sin(camera_rotation.x);
	if(App.keyboard.isKeyPressed(Keyboard.S))
	{
		camera.position.z -= speed_walk * angle_cos;
		camera.position.x -= speed_walk * angle_sin;
	}
	if(App.keyboard.isKeyPressed(Keyboard.W))
	{
		camera.position.z += speed_walk * angle_cos;
		camera.position.x += speed_walk * angle_sin;
	}

	var angle_cos = Math.cos(camera_rotation.x + Math.PI/2.0);
	var angle_sin = Math.sin(camera_rotation.x + Math.PI/2.0);
	if(App.keyboard.isKeyPressed(Keyboard.A))
	{
		camera.position.z += speed_walk * angle_cos;
		camera.position.x += speed_walk * angle_sin;
	}
	if(App.keyboard.isKeyPressed(Keyboard.D))
	{
		camera.position.z -= speed_walk * angle_cos;
		camera.position.x -= speed_walk * angle_sin;
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