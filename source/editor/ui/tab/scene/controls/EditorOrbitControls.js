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

EditorOrbitControls.prototype.attach = function(camera)
{
	while(this.children.length > 0)
	{
		this.remove(this.children[0]);
	}

	this.add(camera);
};

EditorOrbitControls.prototype.reset = function()
{
	//TODO <ADD CODE HERE>
};

EditorOrbitControls.prototype.focusObject = function(object)
{
	var box = ObjectUtils.calculateBoundingBox(object);
	box.applyMatrix4(object.matrixWorld);
	box.getCenter(this.center);

	var size = box.getSize(new THREE.Vector3());
	this.distance = size.length() * 2.0;
	this.updateControls();
};

EditorOrbitControls.prototype.setOrientation = function(code)
{
	console.log("Orientation: " + code);
	
	/*if(code === OrientationCube.Z_POS)
	{
		this.cameraRotation.set(Math.PI / 2, 0);
	}
	else if(code === OrientationCube.Z_NEG)
	{
		this.cameraRotation.set(-Math.PI / 2, 0);
	}
	else if(code === OrientationCube.X_POS)
	{
		this.cameraRotation.set(0, 0);
	}
	else if(code === OrientationCube.X_NEG)
	{
		this.cameraRotation.set(Math.PI, 0);
	}
	else if(code === OrientationCube.Y_POS)
	{
		this.cameraRotation.set(Math.PI, 1.57);
	}
	else if(code === OrientationCube.Y_NEG)
	{
		this.cameraRotation.set(Math.PI, -1.57);
	}

	this.setCameraRotationOrbit(this.cameraRotation, this.cameraLookAt, this.cameraDistance, this.camera);*/
};

EditorOrbitControls.prototype.update = function(mouse, keyboard)
{
	/*
	//Look around
	if(this.mouse.buttonPressed(Mouse.LEFT) && !this.isEditingObject)
	{
		if(Settings.editor.invertNavigation)
		{
			this.cameraRotation.y += Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
		}
		else
		{
			this.cameraRotation.y -= Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
		}

		this.cameraRotation.x -= Settings.editor.mouseLookSensitivity * this.mouse.delta.x;

		if(this.cameraRotation.y < -1.57)
		{
			this.cameraRotation.y = -1.57;
		}
		else if(this.cameraRotation.y > 1.57)
		{
			this.cameraRotation.y = 1.57;
		}
	}

	//Zoom
	if(this.mouse.wheel !== 0)
	{
		this.cameraDistance += this.camera.position.distanceTo(this.cameraLookAt) * Settings.editor.mouseWheelSensitivity * this.mouse.wheel;
		if(this.cameraDistance < 0)
		{
			this.cameraDistance = 0;
		}
	}

	if(this.mouse.buttonPressed(Mouse.MIDDLE))
	{
		this.cameraDistance += this.mouse.delta.y * 0.1;
		if(this.cameraDistance < 0)
		{
			this.cameraDistance = 0;
		}
	}

	//WASD movement
	if(Settings.editor.keyboardNavigation)
	{
		if(Editor.keyboard.keyPressed(Keyboard.W))
		{
			var direction = this.camera.getWorldDirection(this.tempVector3);
			direction.y = 0;
			direction.normalize();

			this.cameraLookAt.x += direction.x * Settings.editor.keyboardNavigationSpeed;
			this.cameraLookAt.z += direction.z * Settings.editor.keyboardNavigationSpeed;
		}
		if(Editor.keyboard.keyPressed(Keyboard.S))
		{
			var direction = this.camera.getWorldDirection(this.tempVector3);
			direction.y = 0;
			direction.normalize();

			this.cameraLookAt.x -= direction.x * Settings.editor.keyboardNavigationSpeed;
			this.cameraLookAt.z -= direction.z * Settings.editor.keyboardNavigationSpeed;
		}
		if(Editor.keyboard.keyPressed(Keyboard.D))
		{
			var direction = this.camera.getWorldDirection(this.tempVector3);
			direction.y = 0;
			direction.normalize();
			direction.applyAxisAngle(SceneEditor.UP, 1.57);

			this.cameraLookAt.x -= direction.x * Settings.editor.keyboardNavigationSpeed;
			this.cameraLookAt.z -= direction.z * Settings.editor.keyboardNavigationSpeed;
		}
		if(Editor.keyboard.keyPressed(Keyboard.A))
		{
			var direction = this.camera.getWorldDirection(this.tempVector3);
			direction.y = 0;
			direction.normalize();
			direction.applyAxisAngle(SceneEditor.UP, 1.57);

			this.cameraLookAt.x += direction.x * Settings.editor.keyboardNavigationSpeed;
			this.cameraLookAt.z += direction.z * Settings.editor.keyboardNavigationSpeed;
		}
	}

	//Move target point
	if(this.mouse.buttonPressed(Mouse.RIGHT))
	{
		var direction = this.camera.getWorldDirection(this.tempVector3);
		direction.y = 0;
		direction.normalize();

		var speed = Settings.editor.mouseMoveSpeed * 10;

		this.cameraLookAt.x += direction.x * this.mouse.delta.y * speed;
		this.cameraLookAt.z += direction.z * this.mouse.delta.y * speed;

		direction.applyAxisAngle(SceneEditor.UP, 1.57);

		this.cameraLookAt.x += direction.x * this.mouse.delta.x * speed;
		this.cameraLookAt.z += direction.z * this.mouse.delta.x * speed;
	}

	this.setCameraRotationOrbit(this.cameraRotation, this.cameraLookAt, this.cameraDistance, this.camera);
	*/

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
