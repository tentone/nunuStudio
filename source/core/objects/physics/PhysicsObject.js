"use strict";

/**
 * Wrapper for cannon.js physics objects.
 *
 * The editor includes tools to create cannon shapes from three.js geometry objects.
 * 
 * Documentation for cannon.js physics available here http:// schteppe.github.io/cannon.js/docs/
 * 
 * @class PhysicsObject
 * @extends {Group}
 * @module Physics
 */
function PhysicsObject()
{
	THREE.Group.call(this);

	this.name = "physics";
	this.type = "Physics";

	/**
	 * Physics body contains the following attributes:
	 *  - position Vec3
	 *  - velocity Vec3
	 *  - torque Vec3
	 *  - angularVelocity Vec3
	 *  - quaternion Quaternion
	 *  - mass Number
	 *  - material Material
	 *  - type Number
	 *  - linearDamping Number
	 *  - angularDamping Number
	 *  - allowSleep Boolean
	 *  - sleepSpeedLimit Number
	 *  - sleepTimeLimit Number
	 *  - collisionFilterGroup Number
	 *  - collisionFilterMask Number
	 *  - fixedRotation Boolean
	 *  - shape Array
	 *  
	 * @attribute body
	 * @type {CANNON.Body}
	 */
	this.body = new CANNON.Body();
	this.body.type = CANNON.Body.DYNAMIC;
	this.body.mass = 1.0;

	/**
	 * Physics object position mode, indicates how coordinates from the physics engine are transformed into object coordinates.
	 *
	 * @attribute mode
	 * @type {number}
	 */
	this.mode = PhysicsObject.LOCAL;

	/**
	 * Refenrece to the physics world.
	 * 
	 * @attribute world
	 * @type {CANNON.World}
	 */
	this.world = null;
}

PhysicsObject.prototype = Object.create(THREE.Group.prototype);

/**
 * The position of the object is copied directly from the body.
 *
 * Ignores the world tranforms inherited from parent objects.
 * 
 * Faster but the physics object should not carry any world transformations.
 *
 * @static
 * @attribute LOCAL
 * @type {number}
 */
PhysicsObject.LOCAL = 100;

/**
 * The position of the object is adjusted to follow the parent object transformation.
 *
 * This mode should be used for objects placed inside others.
 *
 * @static
 * @attribute WORLD
 * @type {number}
 */
PhysicsObject.WORLD = 101;

/**
 * Intialize physics object and add it to the scene physics world.
 * 
 * @method initialize
 */
PhysicsObject.prototype.initialize = function()
{
	if(this.mode === PhysicsObject.LOCAL)
	{
		this.body.position.copy(this.position);
		this.body.quaternion.copy(this.quaternion);	
	}
	else if(this.mode === PhysicsObject.WORLD)
	{
		var position = new THREE.Vector3();
		this.getWorldPosition(position);
		this.body.position.copy(position);

		var quaternion = new THREE.Quaternion();
		this.getWorldQuaternion(quaternion);
		this.body.quaternion.copy(quaternion);
	}

	// Physics world
	var node = this;
	while(node.parent !== null)
	{
		node = node.parent;
		if(node instanceof Scene)
		{
			this.world = node.world;
			this.world.addBody(this.body);
		}
	}

	THREE.Object3D.prototype.initialize.call(this);
};

/**
 * Update object position and rotation based on cannon.js body.
 * 
 * @method update
 */
PhysicsObject.prototype.update = function(delta)
{
	if(this.mode === PhysicsObject.LOCAL)
	{
		this.position.copy(this.body.position);
		if(!this.body.fixedRotation)
		{
			this.quaternion.copy(this.body.quaternion);
		}
	}
	else if(this.mode === PhysicsObject.WORLD)
	{

		// Physics transform matrix
		var transform = new THREE.Matrix4();
		if(this.body.fixedRotation)
		{
			transform.setPosition(this.body.position.x, this.body.position.y, this.body.position.z);
		}
		else
		{
			var quaternion = new THREE.Quaternion();
			quaternion.copy(this.body.quaternion);
			transform.makeRotationFromQuaternion(quaternion);
			transform.setPosition(this.body.position.x, this.body.position.y, this.body.position.z);
		}


		// Get inverse of the world matrix
		var inverse = new THREE.Matrix4();
		inverse.getInverse(this.parent.matrixWorld);

		// Get position, scale and quaternion
		var scale = new THREE.Vector3();
		inverse.multiply(transform);
		inverse.decompose(this.position, this.quaternion, scale);
	}
 
	THREE.Object3D.prototype.update.call(this, delta);
};

/**
 * Add shape to physics object body.
 * 
 * @param {CANNON.Shape} shape
 * @method addShape
 */
PhysicsObject.prototype.addShape = function(shape)
{
	if(shape instanceof CANNON.Shape)
	{
		this.body.addShape(shape);
	}
};

PhysicsObject.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.mode = this.mode;

	// Body
	data.object.body = {};
	data.object.body.type = this.body.type;
	data.object.body.mass = this.body.mass;
	data.object.body.linearDamping = this.body.linearDamping;
	data.object.body.angularDamping = this.body.angularDamping;
	data.object.body.allowSleep = this.body.allowSleep;
	data.object.body.sleepSpeedLimit = this.body.sleepSpeedLimit;
	data.object.body.sleepTimeLimit = this.body.sleepTimeLimit;
	data.object.body.collisionFilterGroup = this.body.collisionFilterGroup;
	data.object.body.collisionFilterMask = this.body.collisionFilterMask;
	data.object.body.fixedRotation = this.body.fixedRotation;
	data.object.body.shapes = [];

	// Shapes array
	var shapes = this.body.shapes;
	for(var i = 0; i < shapes.length; i++)
	{
		var shape = shapes[i];
		var values = {};

		// Shape type
		values.type = shape.type;

		if(shape.type === CANNON.Shape.types.SPHERE)
		{
			values.radius = shape.radius;
		}
		else if(shape.type === CANNON.Shape.types.BOX)
		{
			values.halfExtents = {}
			values.halfExtents.x = shape.halfExtents.x;
			values.halfExtents.y = shape.halfExtents.y;
			values.halfExtents.z = shape.halfExtents.z;
		}
		else if(shape.type === CANNON.Shape.types.CONVEXPOLYHEDRON)
		{
			values.vertices = shape.vertices;
			values.faces = shape.faces;
		}
		else if(shape.type === CANNON.Shape.types.TRIMESH)
		{
			values.vertices = shape.vertices;
			values.normals = shape.normals;
			values.edges = shape.edges;
			values.indices = shape.indices;
		}

		// Add shape
		data.object.body.shapes[i] = values;
	}

	return data;
};


PhysicsObject.fromJSON = function(data)
{
	var object = new PhysicsObject();
	
	if(data.mode !== undefined)
	{
		object.mode = data.mode;
	}

	object.body.type = data.body.type;
	object.body.mass = data.body.mass;
	object.body.linearDamping = data.body.linearDamping;
	object.body.angularDamping = data.body.angularDamping;
	object.body.allowSleep = data.body.allowSleep;
	object.body.sleepSpeedLimit = data.body.sleepSpeedLimit;
	object.body.sleepTimeLimit = data.body.sleepTimeLimit;
	object.body.collisionFilterGroup = data.body.collisionFilterGroup;
	object.body.collisionFilterMask = data.body.collisionFilterMask;
	object.body.fixedRotation = data.body.fixedRotation;

	var shapes = data.body.shapes;
	for(var i = 0; i < shapes.length; i++)
	{
		var shape = shapes[i];

		if(shape.type === CANNON.Shape.types.SPHERE)
		{
			object.body.addShape(new CANNON.Sphere(shape.radius));
		}
		else if(shape.type === CANNON.Shape.types.BOX)
		{
			object.body.addShape(new CANNON.Box(new CANNON.Vec3(shape.halfExtents.x, shape.halfExtents.y, shape.halfExtents.z)));
		}
		else if(shape.type === CANNON.Shape.types.PARTICLE)
		{
			object.body.addShape(new CANNON.Particle());
		}
		else if(shape.type === CANNON.Shape.types.PLANE)
		{
			object.body.addShape(new CANNON.Plane());
		}
		else if(shape.type === CANNON.Shape.types.CONVEXPOLYHEDRON)
		{

			/*if(json.mipmaps[i].data.toArrayBuffer !== undefined)
			{
			json.mipmaps[i].data = new Uint8Array(json.mipmaps[i].data.toArrayBuffer());
			}*/

			// TODO <REMOVE THIS>
			console.log("CONVEXPOLYHEDRON shape cannon", shape, data);
			
			object.body.addShape(new CANNON.ConvexPolyhedron(shape.vertices, shape.faces));
		}
	}

	return object;
};
