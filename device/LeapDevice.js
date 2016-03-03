function LeapDevice(){}

//Leap Hand Modes
LeapDevice.DESK = 0;
LeapDevice.HDM_MOUNTED = 1;

//Initialize LeapDevice
LeapDevice.initialize = function()
{
	LeapDevice.scene = new THREE.Scene();
	LeapDevice.base_rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI/2));
	
	LeapDevice.bone_meshes = [];
	LeapDevice.arm_meshes = [];

	//Hand Atributes
	LeapDevice.use_arm = false;
	LeapDevice.mode = LeapDevice.DESK;
	LeapDevice.camera = null;
	LeapDevice.scale = new THREE.Vector3(1,1,1);
	LeapDevice.position = new THREE.Vector3(0,1,-2);

	//Start leap and set callback function
	Leap.loop({}, LeapDevice.updateLeap).connect();
}

//CHeck if there is a leap device available
LeapDevice.isAvailable = function()
{
	//TODO <ADD CODE HERE>
}

//Update leap status
LeapDevice.updateLeap = function(frame)
{
	//Clear leap scene
	LeapDevice.arm_meshes.forEach(function(item)
	{
		LeapDevice.scene.remove(item)
	});
	
	LeapDevice.bone_meshes.forEach(function(item)
	{
		LeapDevice.scene.remove(item)
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
				var boneMesh = LeapDevice.bone_meshes[countBones] || LeapDevice.addMesh(LeapDevice.bone_meshes);
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
}

LeapDevice.addMesh = function(meshes)
{
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var material = new THREE.MeshPhongMaterial(0x222200);
	var mesh = new THREE.Mesh(geometry, material);
	meshes.push(mesh);
	return mesh;
}

LeapDevice.updateMesh = function(bone, mesh)
{
	mesh.position.fromArray(bone.center());
	mesh.position.divideScalar(150);

	mesh.setRotationFromMatrix((new THREE.Matrix4()).fromArray(bone.matrix()));
	mesh.quaternion.multiply(LeapDevice.base_rotation);
	mesh.scale.set(bone.width/150, bone.width/150, bone.length/150);

	mesh.position.add(LeapDevice.position);

	if(LeapDevice.camera != null)
	{
		mesh.position.add(camera.position);
	}

	LeapDevice.scene.add(mesh);
}
