function LeapHand()
{
	THREE.Object3D.call(this);

	this.type = "LeapDevice";
	this.name = "leap";

	//Leap configuration
	this.debug_model = true;
	this.gestures_enabled = true;
	this.poses_enabled = true;
	this.mode = LeapHand.DESK;
	this.use_arm = false;

	//Hand and Arm meshes
	this.bone_meshes = [];
	this.arm_meshes = [];

	//Debug Hand Material and Geometry
	this.material = new THREE.MeshPhongMaterial();
	this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);

	//Physics
	this.physics_world = null;
	this.physics_bodys = [];

	//Gesture
	this.gesture = []
	for(var i = 0; i < 10; i++)
	{
		this.gesture[i] = false;
	}

	//Poses
	this.pose = [];
	for(var i = 0; i < 3; i++)
	{
		this.pose[i] = false;
	}

	//Data storage
	this.data = null;

	//Start leap worker to collect data
	var self = this;
	Leap.loop({background:true}, function(data)
	{
		self.data = data;
	}).connect();
}

LeapHand.prototype = Object.create(THREE.Object3D.prototype);

LeapHand.prototype.initialize = initialize;
LeapHand.prototype.update = update;
LeapHand.prototype.toJSON = toJSON;

LeapHand.prototype.setMode = setMode;
LeapHand.prototype.checkGesture = checkGesture;
LeapHand.prototype.checkPose = checkPose;
LeapHand.prototype.getMovement = getMovement;

LeapHand.prototype.updateDebugModel = updateDebugModel;
LeapHand.prototype.updatePoses = updatePoses;
LeapHand.prototype.updateGestures = updateGestures;

LeapHand.prototype.addMesh = addMesh;
LeapHand.prototype.updateMesh = updateMesh;
LeapHand.prototype.updatePhysics = updatePhysics;

//Leap Hand Modes
LeapHand.DESK = 0;
LeapHand.HDM = 1;

//Leap Hand Gestures
LeapHand.SWIPE = 0;
LeapHand.SWIPE_LEFT = 1;
LeapHand.SWIPE_RIGHT = 2;
LeapHand.SWIPE_FRONT = 3;
LeapHand.SWIPE_BACK = 4;
LeapHand.SWIPE_UP = 5;
LeapHand.SWIPE_DOWN = 6;
LeapHand.CIRCLE = 7;
LeapHand.SCREEN_TAP = 8;
LeapHand.KEY_TAP = 9;

//Leap Hand Poses
LeapHand.CLOSED = 0;
LeapHand.OPEN = 1;
LeapHand.POINTING = 2;

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update leap status
function update()
{
	if(this.data !== null)
	{
		if(this.gestures_enabled)
		{
			this.updateGestures();	
		}
		if(this.poses_enabled)
		{
			this.updatePoses();
		}
		if(this.debug_model)
		{
			this.updateDebugModel();
		}
	}

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Check if gesture is occuring
function checkGesture(gesture)
{
	if(this.gesture[gesture] !== undefined)
	{
		return this.gesture[gesture];
	}
	return false;
}

//Check if hand is in pose
function checkPose(pose)
{
	if(this.pose[pose] !== undefined)
	{
		return this.pose[pose];
	}
	return false;
}

//Change Mode
function setMode(mode)
{
	this.mode = mode;
}

//Update leap pose flsgs from collected data
function updatePoses()
{
	//Clean all pose flags
	for(var i = 0; i < this.pose.length; i++)
	{
		this.pose[i] = true;
	}

	for(var j = 0; j < this.data.hands.length; j++)
	{
		var hand = this.data.hands[j];

		var center = hand.sphereCenter;
		center = new THREE.Vector3(center[0], center[1], center[2]);

		//Fingers position 
		var distance = [];
		var indicator_distance = 0;
		var finger_joint = [];

		//Clear pose status list
		for(var i = 0; i < this.pose.length; i++)
		{
			this.pose[i] = true;
		}

		//Fingers direction array
		var finger_direction = [];

		for(var i = 0; i < hand.fingers.length; i++)
		{
			var finger = hand.fingers[i];

			finger_direction.push(finger.direction);
			finger_joint = finger.distal.nextJoint;

			var joint = new THREE.Vector3(finger_joint[0], finger_joint[1], finger_joint[2]);
			distance.push((center.distanceTo(joint))/hand._scaleFactor);

			if(i !== 0)
			{
				if(finger_direction[i][2] < 0.3)
				{
					this.pose[LeapHand.CLOSED] = false;
				}
				
				if(finger_direction[i][2] > -0.5)
				{
					this.pose[LeapHand.OPEN] = false;
				}

				if(i === 1)
				{
					indicator_distance = distance[1];
				}
				else if(indicator_distance < 2 * distance[i] - 15)
				{
					this.pose[LeapHand.POINTING] = false;
				}
			}
		}

		if(indicator_distance < 2 * distance[0] - 15)
		{
			this.pose[LeapHand.POINTING] = false;
		}
	}
}

//Update leap gesture flags from collected data
function updateGestures()
{
	//Clean all event flags
	for(var i = 0; i < this.gesture.length; i++)
	{
		this.gesture[i] = false;
	}
	
	var self = this;

	//Gesture detection
	if(this.data.valid && this.data.gestures.length > 0)
	{
		this.data.gestures.forEach(function(gesture)
		{
			if(gesture.type === "swipe")
			{
				//var direction;
				self.gesture[LeapHand.SWIPE] = true;

				//X Direction
				if(gesture.direction[0] > 0)
				{	
					self.gesture[LeapHand.SWIPE_RIGHT] = true;
				}
				else
				{
					self.gesture[LeapHand.SWIPE_LEFT] = true;
				}

				//Y Direction
				if(gesture.direction[1] > 0)
				{
					self.gesture[LeapHand.SWIPE_UP] = true;
				}
				else
				{
					self.gesture[LeapHand.SWIPE_DOWN] = true;
				}

				//Z Direction
				if(gesture.direction[2] > 0)
				{
					self.gesture[LeapHand.SWIPE_FRONT] = true;
				}
				else
				{
					self.gesture[LeapHand.SWIPE_BACK] = true;
				}
			}
			else if(gesture.type === "circle")
			{
				self.gesture[LeapHand.CIRCLE] = true;	
			}
			else if(gesture.type === "keyTap")
			{
				self.gesture[LeapHand.KEY_TAP] = true;	
			}
			else if(gesture.type === "screenTap")
			{
				self.gesture[LeapHand.SCREEN_TAP] = true;	
			}
		});
	}
}

//Update debug hand model
function updateDebugModel()
{
	//Self pointer
	var self = this;

	//Remove all children
	this.arm_meshes.forEach(function(item)
	{
		self.remove(item);
	});
	
	this.bone_meshes.forEach(function(item)
	{
		self.remove(item);
	});

	//Update bones
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
					var boneMesh = this.bone_meshes[countBones] || this.addMesh(this.bone_meshes);
					this.updateMesh(bone, boneMesh);	
				}
				countBones++;
			}
		}
		
		if(this.show_arm)
		{
			var arm = hand.arm;
			var armMesh = this.arm_meshes[countArms++] || this.addMesh(this.arm_meshes);
			this.updateMesh(arm, armMesh);
			armMesh.scale.set(arm.width/1200, arm.width/300, arm.length/150);
		}
	}

	//Update Leap Hand
	if(this.physics_world !== null)
	{
		this.updatePhysics()
	}
}

//Add physics bounding box from objet to physics world
function updatePhysics()
{	
	//Remove all physics bodys
	for(var i = 0; i < this.physics_bodys.length; i++)
	{
		this.physics_world.removeBody(this.physics_bodys[i].pop());
	};

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

//Add mesh to hand instance
function addMesh(meshes)
{
	var mesh = new Model3D(this.geometry, this.material);
	mesh.castShadow = this.castShadow;
	mesh.receiveShadow = this.receiveShadow;
	meshes.push(mesh);
	return mesh;
}

//Update mesh position and size
function updateMesh(bone, mesh)
{
	mesh.position.fromArray(bone.center());
	mesh.position.divideScalar(150);

	mesh.setRotationFromMatrix((new THREE.Matrix4()).fromArray(bone.matrix()));
	mesh.scale.set(bone.width/150, bone.width/150, bone.length/150);

	this.add(mesh);
}

//Get hand movement (already temporaly normalized)
function getMovement()
{
	var actual = this.data.gestures[0].position;
	var previous = this.data.gestures[0].startPosition;

	var vel_abs = new THREE.Vector3(actual[0] - previous[0], actual[1] - previous[1], actual[2] - previous[2]);
	vel_abs.divideScalar(this.data.currentFrameRate);

	return vel_abs;
}

//Create JSON for object
function toJSON(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.type = this.type;
	data.object.debug_model = this.debug_model;
	data.object.gestures_enabled = this.gestures_enabled;
	data.object.poses_enabled = this.poses_enabled;
	data.object.mode = this.mode;
	data.object.use_arm = this.use_arm;

	return data;
}
