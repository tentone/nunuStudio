function LeapHand(){}

//Initialize LeapHand
LeapHand.initialize = function()
{
	LeapHand.scene = new THREE.Scene();
	LeapHand.base_rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
	
	LeapHand.bone_meshes = [];
	LeapHand.arm_meshes = [];

	//Hand Atributes
	LeapHand.show_arm = false;
	LeapHand.mode = LeapHand.DESK;
	LeapHand.camera = null;
	LeapHand.scale = new THREE.Vector3(1,1,1);
	LeapHand.position = new THREE.Vector3(0,1,-2);

	//Start leap and set callback function
	Leap.loop({}, LeapHand.updateLeap).connect();
}

//Leap Hand Modes
LeapHand.DESK = 0;
LeapHand.HDM_MOUNTED = 1;

//Update leap status
LeapHand.updateLeap = function(frame)
{
	//Clear leap scene
	LeapHand.arm_meshes.forEach(function(item)
	{
		LeapHand.scene.remove(item)
	});
	
	LeapHand.bone_meshes.forEach(function(item)
	{
		LeapHand.scene.remove(item)
	});

	//Add new Elements to scene
	var countBones = 0;
	var countArms = 0;
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
				var boneMesh = LeapHand.bone_meshes[countBones] || LeapHand.addMesh(LeapHand.bone_meshes);
				LeapHand.updateMesh(bone, boneMesh);
			}
		}

		var arm = hand.arm;
		if(LeapHand.show_arm)
		{
			var armMesh = LeapHand.arm_meshes[countArms++] || LeapHand.addMesh(LeapHand.arm_meshes);
			LeapHand.updateMesh(arm, armMesh);
			armMesh.scale.set(arm.width/1200, arm.width/300, arm.length/150);
		}
	}
}

LeapHand.addMesh = function(meshes)
{
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial(0x222200);
	var mesh = new THREE.Mesh(geometry, material);
	meshes.push(mesh);
	return mesh;
}

LeapHand.updateMesh = function(bone, mesh)
{
	mesh.position.fromArray(bone.center());
	mesh.position.divideScalar(150);

	mesh.setRotationFromMatrix((new THREE.Matrix4()).fromArray(bone.matrix()));
	mesh.quaternion.multiply(LeapHand.base_rotation);
	mesh.scale.set(bone.width/150, bone.width/150, bone.length/150);

	mesh.position.add(LeapHand.position);

	if(LeapHand.camera != null)
	{
		mesh.position.add(camera.position);
	}

	LeapHand.scene.add(mesh);
}
