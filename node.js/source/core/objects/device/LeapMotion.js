"use strict";

//Leap object
function LeapMotion()
{
	THREE.Object3D.call(this);

	this.type = "LeapDevice";
	this.name = "leap";

	//Leap configuration
	this.debugModel = true;
	this.gesturesEnabled = true;
	this.posesEnabled = true;
	this.mode = LeapMotion.DESK;
	this.useArm = false;

	//Hand and Arm meshes
	this.boneMeshes = [];
	this.armMeshes = [];

	//Debug Hand Material and Geometry
	this.material = new THREE.MeshPhongMaterial();
	this.geometry = new THREE.BoxBufferGeometry(1, 1, 1);

	//Physics
	this.physicsWorld = null;
	this.physicsBodys = [];

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
}

LeapMotion.prototype = Object.create(THREE.Object3D.prototype);

//Leap Hand Modes
LeapMotion.DESK = 0;
LeapMotion.HDM = 1;

//Leap Hand Gestures
LeapMotion.SWIPE = 0;
LeapMotion.SWIPE_LEFT = 1;
LeapMotion.SWIPE_RIGHT = 2;
LeapMotion.SWIPE_FRONT = 3;
LeapMotion.SWIPE_BACK = 4;
LeapMotion.SWIPE_UP = 5;
LeapMotion.SWIPE_DOWN = 6;
LeapMotion.CIRCLE = 7;
LeapMotion.SCREEN_TAP = 8;
LeapMotion.KEY_TAP = 9;

//Leap Hand Poses
LeapMotion.CLOSED = 0;
LeapMotion.OPEN = 1;
LeapMotion.POINTING = 2;

//Initialize
LeapMotion.prototype.initialize = function()
{
	//Self pointer
	var self = this;

	//Start leap worker to collect data
	Leap.loop({background:true}, function(data)
	{
		self.data = data;
	}).connect();

	//Initialize children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update leap status
LeapMotion.prototype.update = function()
{
	if(this.data !== null)
	{
		if(this.gesturesEnabled)
		{
			this.updateGestures();	
		}
		if(this.posesEnabled)
		{
			this.updatePoses();
		}
		if(this.debugModel)
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
LeapMotion.prototype.checkGesture = function(gesture)
{
	if(this.gesture[gesture] !== undefined)
	{
		return this.gesture[gesture];
	}
	return false;
}

//Check if hand is in pose
LeapMotion.prototype.checkPose = function(pose)
{
	if(this.pose[pose] !== undefined)
	{
		return this.pose[pose];
	}
	return false;
}

//Change Mode
LeapMotion.prototype.setMode = function(mode)
{
	this.mode = mode;
}

//Update leap pose flsgs from collected data
LeapMotion.prototype.updatePoses = function()
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
		var indicatorDistance = 0;
		var fingerJoint = [];

		//Clear pose status list
		for(var i = 0; i < this.pose.length; i++)
		{
			this.pose[i] = true;
		}

		//Fingers direction array
		var fingerDirection = [];

		for(var i = 0; i < hand.fingers.length; i++)
		{
			var finger = hand.fingers[i];

			fingerDirection.push(finger.direction);
			fingerJoint = finger.distal.nextJoint;

			var joint = new THREE.Vector3(fingerJoint[0], fingerJoint[1], fingerJoint[2]);
			distance.push((center.distanceTo(joint))/hand._scaleFactor);

			if(i !== 0)
			{
				if(fingerDirection[i][2] < 0.3)
				{
					this.pose[LeapMotion.CLOSED] = false;
				}
				
				if(fingerDirection[i][2] > -0.5)
				{
					this.pose[LeapMotion.OPEN] = false;
				}

				if(i === 1)
				{
					indicatorDistance = distance[1];
				}
				else if(indicatorDistance < 2 * distance[i] - 15)
				{
					this.pose[LeapMotion.POINTING] = false;
				}
			}
		}

		if(indicatorDistance < 2 * distance[0] - 15)
		{
			this.pose[LeapMotion.POINTING] = false;
		}
	}
}

//Update leap gesture flags from collected data
LeapMotion.prototype.updateGestures = function()
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
				self.gesture[LeapMotion.SWIPE] = true;

				//X Direction
				if(gesture.direction[0] > 0)
				{	
					self.gesture[LeapMotion.SWIPE_RIGHT] = true;
				}
				else
				{
					self.gesture[LeapMotion.SWIPE_LEFT] = true;
				}

				//Y Direction
				if(gesture.direction[1] > 0)
				{
					self.gesture[LeapMotion.SWIPE_UP] = true;
				}
				else
				{
					self.gesture[LeapMotion.SWIPE_DOWN] = true;
				}

				//Z Direction
				if(gesture.direction[2] > 0)
				{
					self.gesture[LeapMotion.SWIPE_FRONT] = true;
				}
				else
				{
					self.gesture[LeapMotion.SWIPE_BACK] = true;
				}
			}
			else if(gesture.type === "circle")
			{
				self.gesture[LeapMotion.CIRCLE] = true;	
			}
			else if(gesture.type === "keyTap")
			{
				self.gesture[LeapMotion.KEY_TAP] = true;	
			}
			else if(gesture.type === "screenTap")
			{
				self.gesture[LeapMotion.SCREEN_TAP] = true;	
			}
		});
	}
}

//Update debug hand model
LeapMotion.prototype.updateDebugModel = function()
{
	//Self pointer
	var self = this;

	//Remove all children
	this.armMeshes.forEach(function(item)
	{
		self.remove(item);
	});
	
	this.boneMeshes.forEach(function(item)
	{
		self.remove(item);
	});

	//Update bones
	var countBones = 0;
	var countArms = 0;

	//TODO <CHECK THIS CODE USED TO BE FOR OF ...>
	for(var i = 0; i < this.data.hands.length; i++)
	{
		var hand = this.data.hands[i];

		for(var j = 0; j < hand.fingers.length; j++)
		{
			var finger = hand.fingers[j];

			for(var k = 0; k < finger.bones.length; k++)
			{
				var bone = finger.bones[k];
				if(countBones !== 0)
				{
					var boneMesh = this.boneMeshes[countBones] || this.addMesh(this.boneMeshes);
					this.updateMesh(bone, boneMesh);	
				}
				countBones++;
			}
		}
		
		if(this.showArm)
		{
			var arm = hand.arm;
			var armMesh = this.armMeshes[countArms++] || this.addMesh(this.armMeshes);
			this.updateMesh(arm, armMesh);
			armMesh.scale.set(arm.width/1200, arm.width/300, arm.length/150);
		}
	}

	//Update Leap Hand
	if(this.physicsWorld !== null)
	{
		this.updatePhysics()
	}
}

//Add physics bounding box from objet to physics world
LeapMotion.prototype.updatePhysics = function()
{	
	//Remove all physics bodys
	for(var i = 0; i < this.physicsBodys.length; i++)
	{
		this.physicsWorld.removeBody(this.physicsBodys[i].pop());
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

		this.physicsBodys.push(body);
		this.physicsWorld.addBody(body);
	});
}

//Add mesh to hand instance
LeapMotion.prototype.addMesh = function(meshes)
{
	var mesh = new Mesh(this.geometry, this.material);
	mesh.castShadow = this.castShadow;
	mesh.receiveShadow = this.receiveShadow;
	meshes.push(mesh);
	return mesh;
}

//Update mesh position and size
LeapMotion.prototype.updateMesh = function(bone, mesh)
{
	mesh.position.fromArray(bone.center());
	mesh.position.divideScalar(150);

	mesh.setRotationFromMatrix((new THREE.Matrix4()).fromArray(bone.matrix()));
	mesh.scale.set(bone.width/150, bone.width/150, bone.length/150);

	this.add(mesh);
}

//Get hand movement (already temporaly normalized)
LeapMotion.prototype.getMovement = function()
{
	var actual = this.data.gestures[0].position;
	var previous = this.data.gestures[0].startPosition;

	var velAbs = new THREE.Vector3(actual[0] - previous[0], actual[1] - previous[1], actual[2] - previous[2]);
	velAbs.divideScalar(this.data.currentFrameRate);

	return velAbs;
}

//Create JSON for object
LeapMotion.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.type = this.type;
	data.object.debugModel = this.debugModel;
	data.object.gesturesEnabled = this.gesturesEnabled;
	data.object.posesEnabled = this.posesEnabled;
	data.object.mode = this.mode;
	data.object.useArm = this.useArm;

	return data;
}
