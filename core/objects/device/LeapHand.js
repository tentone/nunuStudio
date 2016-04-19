function LeapHand(mode, use_arm)
{
	THREE.Object3D.call(this);

	this.name = "leap";
	this.type = "LeapDevice";

	//Hand and Arm meshes
	this.bone_meshes = [];
	this.arm_meshes = [];

	//Hand Material
	this.material = new THREE.MeshPhongMaterial();

	//Physics
	this.physics_world = null;
	this.physics_bodys = [];

	//Gesture
	this.gesture = []
	for(var i = 0; i < 10; i++)
	{
		this.gesture[i] = false;
	}

	//Hand Atributes
	this.use_arm = false;
	this.mode = LeapHand.DESK;

	//Parameters
	if(mode !== undefined)
	{
		this.mode = mode;
	}
	if(use_arm !== undefined)
	{
		this.use_arm = use_arm;
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
LeapHand.prototype.icon = "editor/files/icons/hw/leap.png";

LeapHand.prototype.initialize = initialize;
LeapHand.prototype.update = update;
LeapHand.prototype.toJSON = toJSON;

LeapHand.prototype.setMode = setMode;
LeapHand.prototype.checkGesture = checkGesture;
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

//Initialize
function initialize()
{
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].initialize !== undefined)
		{
			this.children[i].initialize();
		}
	}
}


//Update leap status
function update()
{
	if(this.data != null)
	{
		var self = this;

		//Clean all event flags
		for(var i = 0; i < 8; i++)
		{
			this.gesture[i] = false;
		}

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

		//Remove all bones from scene
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

		//Update Leap Hand
		if(this.physics_world != null)
		{
			this.updatePhysics()
		}
	}

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		if(this.children[i].update != undefined)
		{
			this.children[i].update();
		}
	}
}

//Check if gesture is occuring
function checkGesture(gest)
{
	if(this.gesture[gest] !== undefined)
	{
		return this.gesture[gest];
	}
	return false;
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

//Add mesh to hand instance
function addMesh(meshes, material)
{
	var geometry = new THREE.BoxGeometry(1, 1, 1);
	var mesh = new THREE.Mesh(geometry, material);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
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

//Create JSON for object
function toJSON(meta)
{
	var isRootObject = (meta === undefined);
	var output = {};

	//If root object initialize base structure
	if(isRootObject)
	{
		meta =
		{
			geometries: {},
			materials: {},
			textures: {},
			images: {}
		};

		output.metadata =
		{
			version: 4.4,
			type: 'Object',
			generator: 'Object3D.toJSON'
		};
	}

	//Script serialization
	var object = {};
	object.uuid = this.uuid;
	object.type = this.type;

	object.mode = this.mode;
	object.use_arm = this.use_arm;

	if(this.name !== '')
	{
		object.name = this.name;
	}
	if(JSON.stringify(this.userData) !== '{}')
	{
		object.userData = this.userData;
	}

	object.castShadow = (this.castShadow === true);
	object.receiveShadow = (this.receiveShadow === true);
	object.visible = !(this.visible === false);

	object.matrix = this.matrix.toArray();

	if(this.geometry !== undefined)
	{
		if(meta.geometries[ this.geometry.uuid ] === undefined)
		{
			meta.geometries[ this.geometry.uuid ] = this.geometry.toJSON( meta );
		}

		object.geometry = this.geometry.uuid;
	}

	if(this.material !== undefined)
	{
		if(meta.materials[this.material.uuid] === undefined)
		{
			meta.materials[this.material.uuid] = this.material.toJSON(meta);
		}

		object.material = this.material.uuid;
	}

	//Collect children data
	if(this.children.length > 0)
	{
		object.children = [];

		for(var i = 0; i < this.children.length; i ++)
		{
			object.children.push( this.children[ i ].toJSON(meta).object);
		}
	}

	if(isRootObject)
	{
		var geometries = extractFromCache( meta.geometries );
		var materials = extractFromCache( meta.materials );
		var textures = extractFromCache( meta.textures );
		var images = extractFromCache( meta.images );

		if(geometries.length > 0)
		{
			output.geometries = geometries;
		}
		if(materials.length > 0)
		{
			output.materials = materials;
		}
		if(textures.length > 0)
		{
			output.textures = textures;
		}
		if(images.length > 0)
		{
			output.images = images;
		}
	}

	output.object = object;
	return output;

	//Extract data from the cache hash remove metadata on each item and return as array
	function extractFromCache(cache)
	{
		var values = [];
		for(var key in cache)
		{
			var data = cache[ key ];
			delete data.metadata;
			values.push( data );
		}

		return values;
	}
}