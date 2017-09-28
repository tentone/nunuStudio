"use strict";

/**
 * First person controls can be controlled using the mouse and keyboard.
 *
 * Provides a navigations system familiar to the one found on FPS games.
 * 
 * The mouse left button can be used to look around, and the keyboard arrows for movement.
 * 
 * @class FirstPersonControls
 * @constructor
 * @extends {Object3D}
 * @module Controls
 */
function FirstPersonControls()
{
	THREE.Object3D.call(this);

	this.name = "orbit";
	this.type = "FirstPersonControls";

	this.moveSpeed = 0.05;
	this.sensitivity = 0.005;

	this.vector = new THREE.Vector2(0, 0);
	this.mouse = null;
	this.keyboard = null;
}

FirstPersonControls.prototype = Object.create(THREE.Object3D.prototype);

FirstPersonControls.prototype.initialize = function()
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

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].initialize();
	}
};

FirstPersonControls.prototype.update = function()
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

	var cos = Math.cos(this.vector.y);
	var direction = new THREE.Vector3(Math.sin(this.vector.x) * cos, Math.sin(this.vector.y), Math.cos(this.vector.x) * cos);
	direction.add(this.position);
	this.lookAt(direction);

	if(this.keyboard.keyPressed(Keyboard.W))
	{
		var direction = this.getWorldDirection();
		direction.normalize();
		direction.multiplyScalar(this.moveSpeed);
		this.position.add(direction);
	}
	if(this.keyboard.keyPressed(Keyboard.S))
	{
		var direction = this.getWorldDirection();
		direction.normalize();
		direction.multiplyScalar(this.moveSpeed);
		this.position.sub(direction);
	}
	if(this.keyboard.keyPressed(Keyboard.A))
	{
		var direction = new THREE.Vector3(Math.sin(this.vector.x - 1.57), 0, Math.cos(this.vector.x - 1.57));
		direction.normalize();
		direction.multiplyScalar(this.moveSpeed);
		this.position.sub(direction);
	}
	if(this.keyboard.keyPressed(Keyboard.D))
	{
		var direction = new THREE.Vector3(Math.sin(this.vector.x + 1.57), 0, Math.cos(this.vector.x + 1.57));
		direction.normalize();
		direction.multiplyScalar(this.moveSpeed);
		this.position.sub(direction);
	}
	
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].update();
	}
};

FirstPersonControls.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	return data;
};