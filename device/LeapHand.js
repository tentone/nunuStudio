function LeapHand()
{
	THREE.Scene.call(this);
	this.name = "leap";

	this.bone_meshes = [];
	this.arm_meshes = [];

	//Hand Material
	this.material = new THREE.MeshPhongMaterial();

	//Physics
	this.physics_world = null;
	this.physics_bodys = [];

	//Hand Atributes
	this.use_arm = false;
	this.mode = this.DESK;
	this.scale = new THREE.Vector3(1,1,1);

	//Start leap and set callback function
	this.controller = new Leap.Controller();
	this.data = null; //Controller data

	var self = this;
	Leap.loop({background:true}, function(data)
	{
		self.data = data;
	}).connect();
}

LeapHand.prototype = Object.create(THREE.Scene.prototype);
LeapHand.prototype.icon = "editor/files/icons/hw/leap.png";

LeapHand.prototype.update = update;
LeapHand.prototype.setMode = setMode;
LeapHand.prototype.updatePhysics = updatePhysics;
LeapHand.prototype.addMesh = addMesh;
LeapHand.prototype.updateMesh = updateMesh;

//Leap Hand Modes
LeapHand.DESK = 0;
LeapHand.HDM = 1;

//Update leap status
function update()
{
	if(this.data != null)
	{
		var self = this;

		//Clear scene
		this.arm_meshes.forEach(function(item)
		{
			self.remove(item);
		});
		
		this.bone_meshes.forEach(function(item)
		{
			self.remove(item);
		});

		//Add new Elements to scene
		var countBones = 0;
		var countArms = 0;

		for(var hand of this.data.hands)
		{
			for(var finger of hand.fingers)
			{
				for(var bone of finger.bones) 
				{
					if(countBones !== 0)
					{
						var boneMesh = this.bone_meshes[countBones] || this.addMesh(this.bone_meshes, this.material);
						this.updateMesh(bone, boneMesh);	
					}
					countBones++;
				}
			}

			var arm = hand.arm;
			if(this.show_arm)
			{
				var armMesh = this.arm_meshes[countArms++] || this.addMesh(this.arm_meshes);
				this.updateMesh(arm, armMesh);
				armMesh.scale.set(arm.width/1200, arm.width/300, arm.length/150);
			}
		}

		//Update Leap Colision box
		if(this.physics_world != null)
		{
			this.updatePhysics()
		}
	}
}

//Change Mode
function setMode(mode)
{
	this.mode = mode;
}

//Add physics bounding box from objet to physics world
function updatePhysics()
{	
	//Remove all physics bodys
	this.physics_bodys.forEach(function(item)
	{
		this.physics_world.removeBody(item);
	});
	this.physics_bodys = [];

	//Create new physics bodys
	this.children.forEach(function(children, j)
	{
		var box = new THREE.BoundingBoxHelper(children);
		box.update();

		var hs = new THREE.Vector3(box.box.max.x - box.box.min.x, box.box.max.y - box.box.min.y, box.box.max.z - box.box.min.z);
		hs.x *= this.scale.x;
		hs.y *= this.scale.y;
		hs.z *= this.scale.z;
		hs.divideScalar(2);

		var pos = box.box.center();
		pos.x *= this.scale.x;
		pos.y *= this.scale.y;
		pos.z *= this.scale.z;
		pos.add(this.position);

		var shape = new CANNON.Box(new CANNON.Vec3(hs.x, hs.y, hs.z));
		var body = new CANNON.Body({mass:0});
		body.addShape(shape);
		body.position.set(pos.x - this.position.x, pos.y - this.position.y, pos.z - this.position.z);
		body.updateMassProperties();

		this.physics_bodys.push(body);
		this.physics_world.addBody(body);
	});
}

function addMesh(meshes, material)
{
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var mesh = new THREE.Mesh(geometry, material);
	meshes.push(mesh);
	return mesh;
}

function updateMesh(bone, mesh)
{
	mesh.position.fromArray(bone.center());
	mesh.position.divideScalar(150);

	mesh.setRotationFromMatrix((new THREE.Matrix4()).fromArray(bone.matrix()));
	mesh.scale.set(bone.width/150, bone.width/150, bone.length/150);

	this.add(mesh);
}
