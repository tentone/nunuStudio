"use strict";

//PhysicsObject constructor
function PhysicsObject()
{
	THREE.Object3D.call(this);

	this.name = "physics";
	this.type = "Physics";

	this.shape = new CANNON.Sphere(1.0);
	this.body = new CANNON.Body({mass : 0.5});
	this.body.type = CANNON.Body.DYNAMIC;
	this.body.addShape(this.shape);

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

	return data;
}