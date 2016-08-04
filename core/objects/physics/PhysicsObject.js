"use strict";

//PhysicsObject constructor
function PhysicsObject()
{
	THREE.Object3D.call(this);

	this.name = "physics";
	this.type = "Physics";

	this.body = new CANNON.Body();
	this.body.type = CANNON.Body.DYNAMIC;
	this.body.mass = 0.5;
	
	this.body.addShape(new CANNON.Sphere(1.0));
	//this.body.addShape(new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)));
	
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

	//Shapes
	data.object.shapes = {};

	return data;
}