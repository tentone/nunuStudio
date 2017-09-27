"use strict";

/**
 * Orbit controls is a container that can be controlled using the mouse.
 * 
 * It can be rotated using the mouse left button, moved with the mouse right button or mouse wheel. 
 * 
 * @class OrbitControls
 * @constructor
 * @extends {Object3D}
 * @module Controls
 */
function OrbitControls()
{
	THREE.Object3D.call(this);

	this.name = "orbit";
	this.type = "OrbitControls";

	this.distance = 3;
	this.sensitivity = 0.001;

	this.center = new THREE.Vector3(0, 0, 0);
	this.vector = new THREE.Vector2(0, 0);
	this.mouse = null;
	this.keyboard = null;
}

OrbitControls.UP = new THREE.Vector3(0, 1, 0);
OrbitControls.ZERO = new THREE.Vector3(0, 0, 0);

OrbitControls.prototype = Object.create(THREE.Object3D.prototype);

OrbitControls.prototype.initialize = function()
{
	var node = this;
	while(node.parent !== null)
	{
		node = node.parent;

		if(node instanceof Program)
		{
			this.mouse = node.mouse;
			this.keyboard = node.keyboard;
		}
	}

	this.center.copy(this.position);

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
};

OrbitControls.prototype.update = function()
{
	if(this.mouse.buttonPressed(Mouse.LEFT))
	{
		this.vector.y -= this.sensitivity * this.mouse.delta.y;
		this.vector.x -= this.sensitivity * this.mouse.delta.x;

		if(this.vector.y < -1.57)
		{
			this.vector.y = -1.57;
		}
		else if(this.vector.y > 1.57)
		{
			this.vector.y = 1.57;
		}
	}

	if(this.mouse.wheel !== 0)
	{
		this.distance += this.mouse.wheel * this.sensitivity;
		if(this.distance < 0)
		{
			this.distance = 0;
		}
	}

	if(this.mouse.buttonPressed(Mouse.MIDDLE))
	{
		this.distance += this.mouse.delta.y * this.sensitivity;
		if(this.distance < 0)
		{
			this.distance = 0;
		}
	}

	//WASD movement
	/*if(this.keyboard.keyPressed(Keyboard.W))
	{
		var direction = this.getWorldDirection();
		direction.y = 0;
		direction.normalize();

		this.center.x += direction.x;
		this.center.z += direction.z;
	}
	if(this.keyboard.keyPressed(Keyboard.S))
	{
		var direction = this.getWorldDirection();
		direction.y = 0;
		direction.normalize();

		this.center.x -= direction.x;
		this.center.z -= direction.z;
	}
	if(this.keyboard.keyPressed(Keyboard.D))
	{
		var direction = this.getWorldDirection();
		direction.y = 0;
		direction.normalize();
		direction.applyAxisAngle(OrbitControls.UP, 1.57);

		this.center.x -= direction.x;
		this.center.z -= direction.z;
	}
	if(this.keyboard.keyPressed(Keyboard.A))
	{
		var direction = this.getWorldDirection();
		direction.y = 0;
		direction.normalize();
		direction.applyAxisAngle(OrbitControls.UP, 1.57);

		this.center.x += direction.x;
		this.center.z += direction.z;
	}*/

	/*if(this.mouse.buttonPressed(Mouse.RIGHT))
	{
		var direction = this.getWorldDirection();
		direction.y = 0;
		direction.normalize();

		this.center.x += direction.x * this.mouse.delta.y * this.sensitivity;
		this.center.z += direction.z * this.mouse.delta.y * this.sensitivity;

		direction.applyAxisAngle(OrbitControls.UP, 1.57);

		this.center.x += direction.x * this.mouse.delta.x * this.sensitivity;
		this.center.z += direction.z * this.mouse.delta.x * this.sensitivity;
	}*/

	var cos = this.distance * Math.cos(this.vector.y);
	this.position.set(0, 0, 0);
	
	var temp = new THREE.Vector3(Math.cos(this.vector.x) * cos, this.distance * Math.sin(this.vector.y), Math.sin(this.vector.x) * cos);
	temp.add(this.center);

	this.lookAt(temp);
	this.position.copy(temp);

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
};

OrbitControls.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.distance = this.distance;
	data.object.sensitivity = this.sensitivity;

	return data;
};