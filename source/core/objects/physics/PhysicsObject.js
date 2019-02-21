"use strict";

/**
 * Wrapper for cannon.js physics objects.
 * 
 * Physics coordinates are always calculated in local space, they should always be placed directly inside the scene or inside containers without any offset.
 *
 * nunuStudio includes tools to create cannon shapes from three geometry objects.
 * 
 * Documentation for cannon.js physics available here http://schteppe.github.io/cannon.js/docs/
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
	 * Physics body contains the following attributes.
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
	 * Physics world.
	 * 
	 * @attribute world
	 * @type {CANNON.World}
	 */
	this.world = null;
}

PhysicsObject.prototype = Object.create(THREE.Group.prototype);

/**
 * Intialize physics object and add it to the scene physics world.
 * 
 * @method initialize
 */
PhysicsObject.prototype.initialize = function()
{
	/*var position = this.getWorldPosition();
	this.body.position.copy(position);

	var quaternion = this.getWorldQuaternion();
	this.body.quaternion.copy(quaternion);*/
	
	this.body.position.copy(this.position);
	this.body.quaternion.copy(this.quaternion);

	//Physics world
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
	this.position.copy(this.body.position);
	if(!this.body.fixedRotation)
	{
		this.quaternion.copy(this.body.quaternion);
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

/**
 * Create JSON for object.
 *
 * Need to backup material and geometry and set to undefined to avoid it being stored.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
PhysicsObject.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	//Body
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

	//Shapes array
	var shapes = this.body.shapes;
	for(var i = 0; i < shapes.length; i++)
	{
		var shape = shapes[i];
		var values = {};

		//Shape type
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

		//Add shape
		data.object.body.shapes[i] = values;
	}

	return data;
};
