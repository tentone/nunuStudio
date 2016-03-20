function BaseObject()
{
	//Super
	THREE.Scene.call(this);

	//BaseObject Info
	this.name = "obj";
	this.type = BaseObject.TYPE_CONTAINER;

	//Childrens and scripts
	this.children = [];

	//Parent
	this.parent = null;

	//ThreeJS mesh and CannonJS body instances
	this.body = null;
}

//BaseObject type
BaseObject.TYPE_CONTAINER = 0;
BaseObject.TYPE_MODEL = 1;
BaseObject.TYPE_LIGHT = 2;
BaseObject.TYPE_CAMERA = 3;
BaseObject.TYPE_PARTICLE_EMITER = 4;
BaseObject.TYPE_SCRIPT = 5;

//Functions Prototype
BaseObject.prototype = Object.create(THREE.Scene.prototype);
BaseObject.prototype.update = update;
BaseObject.prototype.createPhysicsBoundingBox = createPhysicsBoundingBox;
BaseObject.prototype.setShadowReceiving = setShadowReceiving;
BaseObject.prototype.setShadowCasting = setShadowCasting;

//Update object status
function update()
{
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
}

//Add physics bounding box from objet to physics world
function createPhysicsBoundingBox(object, world)
{
	for(var j = 0; j < object.children.length; j++)
	{
		var box = new THREE.BoundingBoxHelper(object.children[j]);
		box.update();

		var hs = new THREE.Vector3(box.box.max.x - box.box.min.x, box.box.max.y - box.box.min.y, box.box.max.y - box.box.min.z);
		hs.x *= object.scale.x;
		hs.y *= object.scale.y;
		hs.z *= object.scale.z;
		hs.divideScalar(2);

		var pos = box.box.center();
		pos.x *= object.scale.x;
		pos.y *= object.scale.y;
		pos.z *= object.scale.z;
		pos.add(object.position);

		var shape = new CANNON.Box(new CANNON.Vec3(hs.x, hs.y, hs.z));
		var body = new CANNON.Body({mass:0});
		body.addShape(shape);
		body.quaternion.setFromEuler(0,Math.PI/2,0,"XYZ");
		body.position.set(pos.x, pos.y, pos.z);
		body.updateMassProperties();

		world.addBody(body);
	}
}

//Set shadow receiving
function setShadowReceiving(object, state)
{
	//TODO <APPLY TO SELF>
	object.receiveShadow = true;

	for(var i = 0; i < object.children.length; i++)
	{
		setShadowReceiving(object.children[i], state);
	}
}

//Enable shadow casting
function setShadowCasting(object, state)
{
	//TODO <APPLY TO SELF>
	object.castShadow = true;

	for(var i = 0; i < object.children.length; i++)
	{
		setShadowCasting(object.children[i], state);
	}
}
