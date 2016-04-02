function LeapHand(){}

//Leap Hand Modes
LeapHand.DESK = 0;
LeapHand.HDM = 1;

//Initialize LeapHand
LeapHand.initialize = function()
{
	LeapHand.scene = new THREE.Scene();
	
	LeapHand.bone_meshes = [];
	LeapHand.arm_meshes = [];

	//Physics
	LeapHand.physics_world = null;
	LeapHand.physics_bodys = [];

	//Hand Atributes
	LeapHand.use_arm = false;
	LeapHand.mode = LeapHand.DESK;
	LeapHand.scale = new THREE.Vector3(1,1,1);

	//Start leap and set callback function
	LeapHand.controller = new Leap.Controller();
	Leap.loop({background:true}, LeapHand.updateLeap).connect();
}

//Change Mode
LeapHand.setMode = function(mode)
{
	LeapHand.mode = mode;
}

//Update leap status
LeapHand.updateLeap = function(frame)
{
	//Clear leap scene
	LeapHand.arm_meshes.forEach(function(item)
	{
		LeapHand.scene.remove(item);
	});
	
	LeapHand.bone_meshes.forEach(function(item)
	{
		LeapHand.scene.remove(item);
	});

	//Add new Elements to scene
	var countBones = 0;
	var countArms = 0;

	frame.hands.forEach(function(hand)
	{
		var material = new THREE.MeshPhongMaterial({color: 0x00ff00});
		
		hand.fingers.forEach(function(finger)
		{
			finger.bones.forEach(function(bone) 
			{
				if(countBones++ !== 0)
				{
					var boneMesh = LeapHand.bone_meshes[countBones] || LeapHand.addMesh(LeapHand.bone_meshes, material);
					LeapHand.updateMesh(bone, boneMesh);	
				}
			});
		});

		var arm = hand.arm;
		if(LeapHand.show_arm)
		{
			var armMesh = LeapHand.arm_meshes[countArms++] || LeapHand.addMesh(LeapHand.arm_meshes);
			LeapHand.updateMesh(arm, armMesh);
			armMesh.scale.set(arm.width/1200, arm.width/300, arm.length/150);
		}
	});

	//Update Leap Colision box
	if(LeapHand.physics_world != null)
	{
		LeapHand.updatePhysics(LeapHand.scene, LeapHand.physics_world)
	}
	
}

//Add physics bounding box from objet to physics world
LeapHand.updatePhysics = function(object, world)
{	
	//Remove all physics bodys
	LeapHand.physics_bodys.forEach(function(item)
	{
		LeapHand.physics_world.removeBody(item);
	});
	LeapHand.physics_bodys = [];

	//Create new physics bodys
	object.children.forEach(function(children, j)
	{
		var box = new THREE.BoundingBoxHelper(children);
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

		LeapHand.physics_bodys.push(body);
		world.addBody(body);
	});
}


LeapHand.addMesh = function(meshes, material)
{
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var mesh = new THREE.Mesh(geometry, material);
	meshes.push(mesh);
	return mesh;
}

LeapHand.updateMesh = function(bone, mesh)
{
	mesh.position.fromArray(bone.center());
	mesh.position.divideScalar(150);

	mesh.setRotationFromMatrix((new THREE.Matrix4()).fromArray(bone.matrix()));
	mesh.scale.set(bone.width/150, bone.width/150, bone.length/150);

	LeapHand.scene.add(mesh);
}
