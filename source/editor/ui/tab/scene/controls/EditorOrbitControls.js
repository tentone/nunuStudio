"use strict";

/**
 * Orbit controls object can be controlled using the mouse.
 * 
 * It can be rotated using the mouse left button, moved with the mouse right button or mouse wheel.
 */
function EditorOrbitControls()
{
	THREE.Object3D.call(this);

	this.distance = 4;
	this.maxDistance = Number.MAX_SAFE_INTEGER;
	this.minDistance = 0.00000001;
	this.sensitivity = 0.002;
	this.zoomSensitivity = 0.001;
	this.limitUp = 1.57;
	this.limitDown = -1.57;

	this.needsButtonPressed = true;
	this.zoomEnabled = true;
	this.movementEnabled = true;

	this.center = new THREE.Vector3(0, 0, 0);
	this.vector = new THREE.Vector2(0, 0);

	this.tempVector = new THREE.Vector3();

	this.updateControls();
}

EditorOrbitControls.UP = new THREE.Vector3(0, 1, 0);
EditorOrbitControls.ZERO = new THREE.Vector3(0, 0, 0);

EditorOrbitControls.prototype = Object.create(THREE.Object3D.prototype);

EditorOrbitControls.prototype.focusObject = function(object)
{
	var box = ObjectUtils.calculateBoundingBox(object);
	box.applyMatrix4(object.matrixWorld);
	box.getCenter(this.center);

	var size = box.getSize(new THREE.Vector3());
	this.distance = size.length() * 2.0;
	this.updateControls();
};

EditorOrbitControls.prototype.update = function(mouse)
{
	var needsUpdate = false;

	if(!this.needsButtonPressed || mouse.buttonPressed(Mouse.LEFT))
	{
		this.vector.y -= this.sensitivity * mouse.delta.y;
		this.vector.x -= this.sensitivity * mouse.delta.x;
		needsUpdate = true;
	}

	if(this.zoomEnabled)
	{
		if(mouse.wheel !== 0)
		{
			this.distance += mouse.wheel * this.zoomSensitivity * this.position.distanceTo(this.center);
			needsUpdate = true;
		}
	}

	if(mouse.buttonPressed(Mouse.MIDDLE))
	{
		this.center.y += mouse.delta.y * this.sensitivity * this.distance;
		needsUpdate = true;
	}

	if(this.movementEnabled && mouse.buttonPressed(Mouse.RIGHT))
	{
		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();

		var y = mouse.delta.y * this.sensitivity * this.distance;
		this.center.x -= direction.x * y;
		this.center.z -= direction.z * y;

		direction.applyAxisAngle(EditorOrbitControls.UP, 1.57);

		var x = mouse.delta.x * this.sensitivity * this.distance;
		this.center.x -= direction.x * x;
		this.center.z -= direction.z * x;

		needsUpdate = true;
	}

	if(needsUpdate)
	{
		this.updateControls();
	}
};

EditorOrbitControls.prototype.updateControls = function()
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
	matrix.lookAt(this.position, this.center, EditorOrbitControls.UP);
	this.quaternion.setFromRotationMatrix(matrix);	
};
