"use strict";

/**
 * Orbit controls can be used to navigate the world using a imaginary central point as reference.
 *
 * The camera orbits around that central point always looking towards it, and the distance to the point can be changes.
 *
 * @class EditorOrbitControls
 * @extends {EditorControls}
 */
function EditorOrbitControls()
{
	EditorControls.call(this);

	/**
	 * Distance to the center of the orbit.
	 *
	 * @property distance
	 * @type {number}
	 */
	this.distance = 10;

	/**
	 * Central point of the orbit.
	 *
	 * @property center
	 * @type {Vector3}
	 */
	this.center = new THREE.Vector3();

	/**
	 * Orientation of the camera.
	 *
	 * X is the horizontal orientation and Y the vertical orientation.
	 *
	 * @property orientation
	 * @type {Vector2}
	 */	 
	this.orientation = new THREE.Vector2();

	/**
	 * Maximum Distance allowed.
	 *
	 * @property maxDistance
	 * @type {number}
	 */
	this.maxDistance = Number.MAX_SAFE_INTEGER;

	/**
	 * Minimum distance allowed.
	 *
	 * @property minDistance
	 * @type {number}
	 */
	this.minDistance = 1e-10;
	
	/**
	 * Maximum angle allowed in the y (vertical) orientation.
	 *
	 * @property limitUp
	 * @type {number}
	 */
	this.limitUp = 1.57;

	/**
	 * Minimum angle allowed in the y (vertical) orientation.
	 *
	 * @property limitDown
	 * @type {number}
	 */
	this.limitDown = -1.57;
	
	/**
	 * Indicates if the orbit controls needed an update on the last update.
	 *
	 * The variable is reset on each update call.
	 *
	 * @property needsUpdate
	 * @type {boolean}
	 */
	this.needsUpdate = false;

	/**
	 * Enables smooth orbit movement.
	 *
	 * @property smooth
	 * @type {boolean}
	 */	
	this.smooth = false;

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
	 * @property speed
	 * @type {number}
	 */	
	this.speed = 0.3;
	this.speedDistance = 0;
	this.speedCenter = new THREE.Vector3(0, 0, 0);
	this.speedOrientation = new THREE.Vector2(0, 0);

	this.tempVector = new THREE.Vector3(0, 0, 0);
	this.tempMatrix = new THREE.Matrix4();

	this.reset();
	this.updateControls();
}

EditorOrbitControls.UP = new THREE.Vector3(0, 1, 0);

EditorOrbitControls.prototype = Object.create(EditorControls.prototype);

EditorOrbitControls.prototype.reset = function()
{
	this.distance = 10;
	this.center.set(0, 0, 0);
	this.orientation.set(-0.4, 0.4);
	this.updateControls();
};

EditorOrbitControls.prototype.focusObject = function(object)
{
	var box = ObjectUtils.calculateBoundingBox(object);
	
	if(box !== null)
	{
		box.applyMatrix4(object.matrixWorld);
		box.getCenter(this.center);

		var size = box.getSize(this.tempVector).length();

		if(this.camera instanceof THREE.PerspectiveCamera)
		{
			this.distance = (size / 2) / Math.tan(THREE.Math.DEG2RAD * 0.5 * this.camera.fov);
		}
		else
		{
			this.distance = size;
		}

		this.updateControls();
	}
	else
	{
		object.getWorldPosition(this.center);
		this.distance = this.center.y + 1.0;
		this.updateControls();
	}
};

EditorOrbitControls.prototype.setOrientation = function(code)
{
	if(code === OrientationCube.Z_POS)
	{
		this.orientation.set(Math.PI / 2, 0);
	}
	else if(code === OrientationCube.Z_NEG)
	{
		this.orientation.set(-Math.PI / 2, 0);
	}
	else if(code === OrientationCube.X_POS)
	{
		this.orientation.set(0, 0);
	}
	else if(code === OrientationCube.X_NEG)
	{
		this.orientation.set(Math.PI, 0);
	}
	else if(code === OrientationCube.Y_POS)
	{
		this.orientation.set(Math.PI, 1.57);
	}
	else if(code === OrientationCube.Y_NEG)
	{
		this.orientation.set(Math.PI, -1.57);
	}

	this.updateControls();
};

EditorOrbitControls.prototype.update = function(mouse, keyboard)
{
	this.needsUpdate = false;

	if(mouse.buttonPressed(Mouse.LEFT))
	{
		if(this.smooth === true)
		{
			this.speedOrientation.y += this.speed * Editor.settings.editor.mouseLookSensitivity * (Editor.settings.editor.invertNavigation ? mouse.delta.y : -mouse.delta.y);
			this.speedOrientation.x -= this.speed * Editor.settings.editor.mouseLookSensitivity * mouse.delta.x;
		}
		else
		{
			this.orientation.y += Editor.settings.editor.mouseLookSensitivity * (Editor.settings.editor.invertNavigation ? mouse.delta.y : -mouse.delta.y);
			this.orientation.x -= Editor.settings.editor.mouseLookSensitivity * mouse.delta.x;
		}

		this.needsUpdate = true;
	}

	if(mouse.buttonPressed(Mouse.MIDDLE))
	{
		if(this.smooth === true)
		{
			this.speedCenter.y += this.speed * Editor.settings.editor.mouseLookSensitivity * mouse.delta.y * this.distance;
		}
		else
		{
			this.center.y += mouse.delta.y * Editor.settings.editor.mouseLookSensitivity * this.distance;
		}
	
		this.needsUpdate = true;
	}

	if(mouse.buttonPressed(Mouse.RIGHT))
	{
		var direction = this.getWorldDirection(this.tempVector);
		var up = direction.y > 0;
		direction.y = 0;
		direction.normalize();

		if(this.smooth === true)
		{
			var y = this.speed * mouse.delta.y * Editor.settings.editor.mouseLookSensitivity * this.distance;
			this.speedCenter.x += up ? (-direction.x * y) : (direction.x * y);
			this.speedCenter.z += up ? (-direction.z * y) : (direction.z * y);
			
			direction.applyAxisAngle(OrbitControls.UP, Math.PI/2);

			var x = this.speed * mouse.delta.x * Editor.settings.editor.mouseLookSensitivity * this.distance;
			this.speedCenter.x -= direction.x * x;
			this.speedCenter.z -= direction.z * x;
		}
		else
		{
			var y = mouse.delta.y * Editor.settings.editor.mouseLookSensitivity * this.distance;
			this.center.x += up ? (-direction.x * y) : (direction.x * y);
			this.center.z += up ? (-direction.z * y) : (direction.z * y);
			
			direction.applyAxisAngle(EditorOrbitControls.UP, Math.PI/2);

			var x = mouse.delta.x * Editor.settings.editor.mouseLookSensitivity * this.distance;
			this.center.x -= direction.x * x;
			this.center.z -= direction.z * x;
		}

		this.needsUpdate = true;
	}

	if(mouse.wheel !== 0)
	{
		if(this.smooth === true)
		{
			this.speedDistance += this.speed * mouse.wheel * this.distance * Editor.settings.editor.mouseWheelSensitivity;
		}
		else
		{
			this.distance += mouse.wheel * this.distance * Editor.settings.editor.mouseWheelSensitivity;
		}
	
		this.needsUpdate = true;
	}
	
	//Keyboard movement
	if(Editor.settings.editor.keyboardNavigation && this.keyboardMovement(keyboard))
	{
		this.needsUpdate = true;
	}

	//If smooth always update 
	if(this.smooth === true)
	{
		this.distance += this.speedDistance;
		this.center.add(this.speedCenter);
		this.orientation.add(this.speedOrientation);

		this.applyLimits();

		this.speedDistance *= this.friction;
		this.speedOrientation.multiplyScalar(this.friction);
		this.speedCenter.multiplyScalar(this.friction);

		this.updateControls();
		return;
	}

	if(this.needsUpdate === true)
	{
		this.updateControls();
	}
};

OrbitControls.prototype.keyboardMovement = function(keyboard)
{
	if(keyboard === undefined)
	{
		return false;
	}

	var needsUpdate = false;

	if(keyboard.keyPressed(Keyboard.S))
	{
		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();

		this.center.x += direction.x * Editor.settings.editor.keyboardNavigationSpeed;
		this.center.z += direction.z * Editor.settings.editor.keyboardNavigationSpeed;
		needsUpdate = true;
	}
	if(keyboard.keyPressed(Keyboard.W))
	{
		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();

		this.center.x -= direction.x * Editor.settings.editor.keyboardNavigationSpeed;
		this.center.z -= direction.z * Editor.settings.editor.keyboardNavigationSpeed;
		needsUpdate = true;
	}
	if(keyboard.keyPressed(Keyboard.A))
	{
		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();
		direction.applyAxisAngle(EditorOrbitControls.UP, 1.57);

		this.center.x -= direction.x * Editor.settings.editor.keyboardNavigationSpeed;
		this.center.z -= direction.z * Editor.settings.editor.keyboardNavigationSpeed;
		needsUpdate = true;
	}
	if(keyboard.keyPressed(Keyboard.D))
	{
		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();
		direction.applyAxisAngle(EditorOrbitControls.UP, 1.57);

		this.center.x += direction.x * Editor.settings.editor.keyboardNavigationSpeed;
		this.center.z += direction.z * Editor.settings.editor.keyboardNavigationSpeed;
		needsUpdate = true;
	}

	return needsUpdate;
}

EditorOrbitControls.prototype.applyLimits = function()
{
	if(this.orientation.y < this.limitDown)
	{
		this.orientation.y = this.limitDown;
	}
	else if(this.orientation.y > this.limitUp)
	{
		this.orientation.y = this.limitUp;
	}

	if(this.distance < this.minDistance)
	{
		this.distance = this.minDistance;
	}
	else if(this.distance > this.maxDistance)
	{
		this.distance = this.maxDistance;
	}
};

EditorOrbitControls.prototype.updateControls = function()
{
	this.applyLimits();

	var cos = this.distance * Math.cos(this.orientation.y);
	this.position.set(Math.cos(this.orientation.x) * cos, this.distance * Math.sin(this.orientation.y), Math.sin(this.orientation.x) * cos);
	this.position.add(this.center);

	this.tempMatrix.lookAt(this.position, this.center, EditorOrbitControls.UP);
	this.quaternion.setFromRotationMatrix(this.tempMatrix);

	this.updateMatrixWorld(true);

	if(this.camera instanceof OrthographicCamera)
	{
		this.camera.size = this.distance;
		this.camera.updateProjectionMatrix();
	}
};
