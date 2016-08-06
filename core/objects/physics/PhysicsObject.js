"use strict";

//PhysicsObject constructor
function PhysicsObject()
{
	THREE.Object3D.call(this);

	this.name = "physics";
	this.type = "Physics";

	//Body
	this.body = new CANNON.Body();
	this.body.type = CANNON.Body.DYNAMIC;
	this.body.mass = 1.0;
	
	//Shape
	//this.body.addShape(new CANNON.Sphere(1.0));
	//this.body.addShape(new CANNON.Particle());
	//this.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
	//this.body.addShape(new CANNON.Cylinder(1.0, 1.0, 2.0, 8));
	//this.body.addShape(new CANNON.ConvexPolyhedron(points, faces));
	//this.body.addShape(new CANNON.Plane());

	//World pointer
	this.world = null;
}

//Function Prototype
PhysicsObject.prototype = Object.create(THREE.Object3D.prototype);
PhysicsObject.prototype.initialize = initialize;
PhysicsObject.prototype.update = update;
PhysicsObject.prototype.toJSON = toJSON;

//Initialize physics object
function initialize()
{
	//Update body to world position
	this.body.position.copy(this.position);
	this.body.quaternion.copy(this.quaternion);
	
	//Get physics world
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

	//Update children
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
}

//Update physics object
function update()
{
	this.position.copy(this.body.position);
	this.quaternion.copy(this.body.quaternion);

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Create JSON for object
function toJSON(meta)
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

	//Shapes
	var shapes = this.body.shapes;

	for(var i = 0; i < shapes.length; i++)
	{
		var shape = shapes[i];
		var shape_data = {};

		shape_data.type = shape.type;

		if(shape.type === CANNON.Shape.types.SPHERE) //1
		{
			shape_data.radius = shape.radius;
		}
		else if(shape.type === CANNON.Shape.types.PLANE) //2
		{
			//TODO <ADD CODE HERE>
		}
		else if(shape.type === CANNON.Shape.types.BOX) //4
		{
			shape_data.halfExtents = {}
			shape_data.halfExtents.x = shape.halfExtents.x;
			shape_data.halfExtents.y = shape.halfExtents.y;
			shape_data.halfExtents.z = shape.halfExtents.z;
		}
		else if(shape.type === CANNON.Shape.types.CYLINDER) //128
		{
			//TODO <ADD CODE HERE>
		}

		//Add shape
		data.object.body.shapes[i] = shape_data;
	}

	return data;
}