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

	//Zoom
	if(this.mouse.wheel !== 0)
	{
		this.distance += this.sensitivity * this.mouse.wheel;
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
		direction.applyAxisAngle(SceneEditor.UP, 1.57);

		this.center.x -= direction.x;
		this.center.z -= direction.z;
	}
	if(this.keyboard.keyPressed(Keyboard.A))
	{
		var direction = this.getWorldDirection();
		direction.y = 0;
		direction.normalize();
		direction.applyAxisAngle(SceneEditor.UP, 1.57);

		this.center.x += direction.x;
		this.center.z += direction.z;
	}

	if(this.mouse.buttonPressed(Mouse.RIGHT))
	{
		var direction = this.getWorldDirection();
		direction.y = 0;
		direction.normalize();

		var speed = 0.01;

		this.center.x += direction.x * this.mouse.delta.y * speed;
		this.center.z += direction.z * this.mouse.delta.y * speed;

		direction.applyAxisAngle(SceneEditor.UP, 1.57);

		this.center.x += direction.x * this.mouse.delta.x * speed;
		this.center.z += direction.z * this.mouse.delta.x * speed;
	}*/

	//Update camera position and direction
	var cos = this.distance * Math.cos(this.vector.y);
	this.position.set(Math.cos(this.vector.x) * cos, this.distance * Math.sin(this.vector.y), Math.sin(this.vector.x) * cos);
	this.position.add(this.center);
	this.lookAt(this.center);

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