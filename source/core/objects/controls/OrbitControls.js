"use strict";

/**
 * Orbit controls object can be controlled using the mouse.
 * 
 * It can be rotated using the mouse left button, moved with the mouse right button or mouse wheel. 
 * 
 * @class OrbitControls
 * @extends {Group}
 * @module Controls
 */
function OrbitControls()
{
	THREE.Group.call(this);

	this.name = "orbit";
	this.type = "OrbitControls";

	/**
	 * Initial distance of the object relative to the center.
	 * 
	 * @property distance
	 * @default 3
	 * @type {number}
	 */
	this.distance = 4;

	/**
	 * Maximum Distance allowed.
	 *
	 * @property maxDistance
	 * @type {number}
	 */
	this.maxDistance = 20;

	/**
	 * Minimum distance allowed.
	 *
	 * @property minDistance
	 * @type {number}
	 */
	this.minDistance = 2;

	/**
	 * Mouse sensitivity.
	 * 
	 * @property sensitivity
	 * @type {number}
	 */
	this.sensitivity = 0.002;

	/**
	 * Mouse scroll sensitivity.
	 * 
	 * @property zoomSensitivity
	 * @type {number}
	 */
	this.zoomSensitivity = 0.001;

	/**
	 * Top limit angle.
	 * 
	 * @property limitUp
	 * @default 1.57
	 * @type {number}
	 */
	this.limitUp = 1.57;

	/**
	 * Bottom limit angle.
	 * 
	 * @property limitDown
	 * @default -1.57
	 * @type {number}
	 */
	this.limitDown = -1.57;

	/**
	 * Indicates if the button left button needs to be pressed to rotate the object.
	 * 
	 * @property needsButtonPressed
	 * @default true
	 * @type {boolean}
	 */
	this.needsButtonPressed = true;

	/**
	 * Indicates if its possible to zoom in and out to the center point.
	 * 
	 * @property zoomEnabled
	 * @default true
	 * @type {boolean}
	 */
	this.zoomEnabled = true;

	/**
	 * Indicates if its possible to move the object around.
	 * 
	 * @property movementEnabled
	 * @default true
	 * @type {boolean}
	 */
	this.movementEnabled = true;

	/**
	 * Central point of the orbit.
	 *
	 * @property center
	 * @type {Vector3}
	 */
	this.center = new THREE.Vector3(0, 0, 0);

	/**
	 * Orientation of the camera.
	 *
	 * X is the horizontal orientation and Y the vertical orientation.
	 *
	 * @property vector
	 * @type {Vector2}
	 */	
	this.vector = new THREE.Vector2(Math.PI / 2, 0);

	/**
	 * Enables smooth orbit movement.
	 *
	 * @property smooth
	 * @type {boolean}
	 */	
	this.smooth = true;

	/**
	 * Orbit speed friction, higher value allow the orbit to retain more speed.
	 *
	 * Only used when smooth is set true.
	 *
	 * @property friction
	 * @type {number}
	 */	
	this.friction = 0.8;

	/**
	 * Obit movement speed.
	 *
	 * Only used when smooth is set true.
	 *
	 * @property friction
	 * @type {number}
	 */	
	this.speed = 0.3;

	/**
	 * If set true the Y orientation movement is inverted.
	 *
	 * @property invertNavigation
	 * @type {boolean}
	 */
	this.invertNavigation = false;

	this.mouse = null;
	this.keyboard = null;

	this.speedDistance = 0;
	this.speedCenter = new THREE.Vector3(0, 0, 0);
	this.speedOrientation = new THREE.Vector2(0, 0);
	this.tempVector = new THREE.Vector3();
}

OrbitControls.UP = new THREE.Vector3(0, 1, 0);
OrbitControls.ZERO = new THREE.Vector3(0, 0, 0);

OrbitControls.prototype = Object.create(THREE.Group.prototype);

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
	this.updateControls();

	THREE.Group.prototype.initialize.call(this);
};

OrbitControls.prototype.update = function(delta)
{
	var needsUpdate = false;

	if(!this.needsButtonPressed || this.mouse.buttonPressed(Mouse.LEFT))
	{
		if(this.smooth === true)
		{
			this.speedOrientation.y += this.speed * this.sensitivity * (this.invertNavigation ? this.mouse.delta.y : -this.mouse.delta.y);
			this.speedOrientation.x -= this.speed * this.sensitivity * this.mouse.delta.x;
		}
		else
		{
			this.vector.y -= this.sensitivity * (this.invertNavigation ? this.mouse.delta.y : -this.mouse.delta.y);
			this.vector.x -= this.sensitivity * this.mouse.delta.x;
		}
		needsUpdate = true;
	}

	if(this.zoomEnabled)
	{
		if(this.mouse.buttonPressed(Mouse.MIDDLE))
		{
			if(this.smooth === true)
			{
				this.speedCenter.y += this.speed * this.sensitivity * this.mouse.delta.y * this.distance;
			}
			else
			{
				this.center.y += this.sensitivity * this.mouse.delta.y * this.distance;
			}

			needsUpdate = true;
		}

		if(this.mouse.wheel !== 0)
		{
			if(this.smooth === true)
			{
				this.speedDistance += this.speed * this.mouse.wheel * this.position.distanceTo(this.center) * this.sensitivity;
			}
			else
			{
				this.distance += this.mouse.wheel * this.position.distanceTo(this.center) * this.sensitivity;
			}

			needsUpdate = true;
		}
	}

	var up = true;
	
	if(this.movementEnabled && this.mouse.buttonPressed(Mouse.RIGHT))
	{
		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();

		if(this.smooth === true)
		{
			var y = this.speed * this.mouse.delta.y * this.sensitivity * this.distance;
			this.speedCenter.x += up ? (-direction.x * y) : (direction.x * y);
			this.speedCenter.z += up ? (-direction.z * y) : (direction.z * y);
			
			direction.applyAxisAngle(OrbitControls.UP, Math.PI/2);

			var x = this.speed * this.mouse.delta.x * this.sensitivity * this.distance;
			this.speedCenter.x -= direction.x * x;
			this.speedCenter.z -= direction.z * x;
		}
		else
		{
			var y = this.mouse.delta.y * this.sensitivity * this.distance;
			this.center.x += up ? (-direction.x * y) : (direction.x * y);
			this.center.z += up ? (-direction.z * y) : (direction.z * y);
			
			direction.applyAxisAngle(OrbitControls.UP, Math.PI/2);

			var x = this.mouse.delta.x * this.sensitivity * this.distance;
			this.center.x -= direction.x * x;
			this.center.z -= direction.z * x;
		}

		needsUpdate = true;
	}

	if(this.smooth === true)
	{
		this.distance += this.speedDistance;
		this.center.add(this.speedCenter);
		this.vector.add(this.speedOrientation);

		this.speedDistance *= this.friction;
		this.speedOrientation.multiplyScalar(this.friction);
		this.speedCenter.multiplyScalar(this.friction);

		this.updateControls();
		return;
	}

	if(needsUpdate === true)
	{
		this.updateControls();
	}

	THREE.Object3D.prototype.update.call(this, delta);
};

/**
 * Update controls position and rotation.
 *
 * Should be called if some of its properties are changed manually.
 *
 * @method updateControls
 */
OrbitControls.prototype.updateControls = function()
{
	if(this.vector.y < this.limitDown)
	{
		this.vector.y = this.limitDown;
	}
	else if(this.vector.y > this.limitUp)
	{
		this.vector.y = this.limitUp;
	}

	if(this.distance < this.minDistance)
	{
		this.distance = this.minDistance;
	}
	else if(this.distance > this.maxDistance)
	{
		this.distance = this.maxDistance;
	}

	var cos = this.distance * Math.cos(this.vector.y);
	this.position.set(Math.cos(this.vector.x) * cos, this.distance * Math.sin(this.vector.y), Math.sin(this.vector.x) * cos);
	this.position.add(this.center);

	var matrix = new THREE.Matrix4();
	matrix.lookAt(this.position, this.center, OrbitControls.UP);
	this.quaternion.setFromRotationMatrix(matrix);	
};

OrbitControls.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.distance = this.distance;
	data.object.maxDistance = this.maxDistance;
	data.object.minDistance = this.minDistance;
	data.object.sensitivity = this.sensitivity;
	data.object.limitUp = this.limitUp;
	data.object.limitDown = this.limitDown;

	data.object.needsButtonPressed = this.needsButtonPressed;
	data.object.zoomEnabled = this.zoomEnabled;
	data.object.movementEnabled = this.movementEnabled;

	data.object.smooth = this.smooth;
	data.object.friction = this.friction;
	data.object.speed = this.speed;
	data.object.invertNavigation = this.invertNavigation;

	data.object.center = this.center.toArray();
	data.object.vector = this.vector.toArray();

	return data;
};