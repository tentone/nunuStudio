function LeapDevice(){}

//Leap Hand Modes
LeapDevice.DESK = 0;
LeapDevice.HDM = 1;

//Initialize LeapDevice
LeapDevice.initialize = function()
{
	LeapDevice.scene = new THREE.Scene();
	
	LeapDevice.bone_meshes = [];
	LeapDevice.arm_meshes = [];

	//Physics
	LeapDevice.physics_world = null;
	LeapDevice.physics_bodys = [];

	//Hand Atributes
	LeapDevice.use_arm = false;
	LeapDevice.mode = LeapDevice.DESK;
	LeapDevice.scale = new THREE.Vector3(1,1,1);

	//Start leap and set callback function
	LeapDevice.controller = new Leap.Controller();
	Leap.loop({background:true}, LeapDevice.updateLeap).connect();
}

//Change Mode
LeapDevice.setMode = function(mode)
{
	LeapDevice.mode = mode;
}

//Check if gesture ocuring
LeapDevice.gestureOccuring = function(gesture)
{
	//TODO <ADD CODE HERE>
	return false;
}

//Update leap status
LeapDevice.updateLeap = function(frame)
{
	//Clear leap scene
	LeapDevice.arm_meshes.forEach(function(item)
	{
		LeapDevice.scene.remove(item);
	});
	
	LeapDevice.bone_meshes.forEach(function(item)
	{
		LeapDevice.scene.remove(item);
	});

	//Add new Elements to scene
	var countBones = 0;
	var countArms = 0;
	for(var hand of frame.hands)
	{
		var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
		
		for(var finger of hand.fingers)
		{
			for(var bone of finger.bones) 
			{
				if(countBones++ === 0)
				{
					continue;
				}

				var boneMesh = LeapDevice.bone_meshes[countBones] || LeapDevice.addMesh(LeapDevice.bone_meshes, material);
				LeapDevice.updateMesh(bone, boneMesh);
			}
		}

		var arm = hand.arm;
		if(LeapDevice.show_arm)
		{
			var armMesh = LeapDevice.arm_meshes[countArms++] || LeapDevice.addMesh(LeapDevice.arm_meshes);
			LeapDevice.updateMesh(arm, armMesh);
			armMesh.scale.set(arm.width/1200, arm.width/300, arm.length/150);
		}
	}

	//Update Leap Colision box
	if(LeapDevice.physics_world != null)
	{
		LeapDevice.updatePhysics(LeapDevice.scene, LeapDevice.physics_world)
	}
	
}

//Add physics bounding box from objet to physics world
LeapDevice.updatePhysics = function(object, world)
{	
	//Remove all physics bodys
	LeapDevice.physics_bodys.forEach(function(item)
	{
		LeapDevice.physics_world.removeBody(item);
	});
	LeapDevice.physics_bodys = [];

	//Create new physics bodys
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
		body.position.set(pos.x - object.position.x, pos.y - object.position.y, pos.z - object.position.z);
		body.updateMassProperties();

		LeapDevice.physics_bodys.push(body);
		world.addBody(body);
	}
}


LeapDevice.addMesh = function(meshes, material)
{
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var mesh = new THREE.Mesh(geometry, material);
	meshes.push(mesh);
	return mesh;
}

LeapDevice.updateMesh = function(bone, mesh)
{
	mesh.position.fromArray(bone.center());
	mesh.position.divideScalar(150);

	mesh.setRotationFromMatrix((new THREE.Matrix4()).fromArray(bone.matrix()));
	mesh.scale.set(bone.width/150, bone.width/150, bone.length/150);

	LeapDevice.scene.add(mesh);
}
