"use strict";

/**
 * Orbit controls object can be controlled using the mouse.
 * 
 * It can be rotated using the mouse left button, moved with the mouse right button or mouse wheel. 
 * 
 * @class OrbitControls
 * @constructor
 * @extends {Object3D}
 * @module Controls
 */
/**
 * Initial distance of the object relative to the center.
 * 
 * @property distance
 * @default 3
 * @type {Number}
 */
/**
 * Mouse sensitivity.
 * 
 * @property sensitivity
 * @default 0.001
 * @type {Number}
 */
/**
 * Top limit angle.
 * 
 * @property limitUp
 * @default 1.57
 * @type {Number}
 */
/**
 * Bottom limit angle.
 * 
 * @property limitDown
 * @default -1.57
 * @type {Number}
 */
/**
 * Indicates if the button left button needs to be pressed to rotate the object.
 * 
 * @property needsButtonPressed
 * @default true
 * @type {Boolean}
 */
/**
 * Indicates if its possible to move the object around.
 * 
 * @property movementEnabled
 * @default true
 * @type {Boolean}
 */
function OrbitControls()
{
	THREE.Object3D.call(this);

	this.name = "orbit";
	this.type = "OrbitControls";

	this.distance = 4;
	this.sensitivity = 0.001;
	this.limitUp = 1.57;
	this.limitDown = -1.57;
	this.needsButtonPressed = true;
	this.movementEnabled = true;

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
	if(!this.needsButtonPressed || this.mouse.buttonPressed(Mouse.LEFT))
	{
		this.vector.y -= this.sensitivity * this.mouse.delta.y;
		this.vector.x -= this.sensitivity * this.mouse.delta.x;

		if(this.vector.y < this.limitDown)
		{
			this.vector.y = this.limitDown;
		}
		else if(this.vector.y > this.limitUp)
		{
			this.vector.y = this.limitUp;
		}
	}

	if(this.mouse.wheel !== 0)
	{
		this.distance += this.mouse.wheel * this.sensitivity * this.position.distanceTo(this.center);
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

	if(this.movementEnabled && this.mouse.buttonPressed(Mouse.RIGHT))
	{
		var direction = this.getWorldDirection();
		direction.y = 0;
		direction.normalize();

		var y = this.mouse.delta.y * this.sensitivity * this.distance;
		this.center.x -= direction.x * y;
		this.center.z -= direction.z * y;

		direction.applyAxisAngle(OrbitControls.UP, 1.57);

		var x = this.mouse.delta.x * this.sensitivity * this.distance;
		this.center.x -= direction.x * x;
		this.center.z -= direction.z * x;
	}

	var cos = this.distance * Math.cos(this.vector.y);
	this.position.set(Math.cos(this.vector.x) * cos, this.distance * Math.sin(this.vector.y), Math.sin(this.vector.x) * cos);
	this.position.add(this.center);

	var matrix = new THREE.Matrix4();
	matrix.lookAt(this.position, this.center, OrbitControls.UP);
	this.quaternion.setFromRotationMatrix(matrix);

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
	data.object.limitUp = this.limitUp;
	data.object.limitDown = this.limitDown;
	data.object.needsButtonPressed = this.needsButtonPressed;
	
	return data;
};