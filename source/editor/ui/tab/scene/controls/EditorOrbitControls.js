"use strict";

function EditorOrbitControls()
{
	THREE.Object3D.call(this);

	this.distance = 10;
	this.center = new THREE.Vector3(0, 0, 0);
	this.vector = new THREE.Vector2(-0.4, 0.40);

	this.camera = null;

	this.sensitivity = 0.002;
	this.zoomSensitivity = 0.001;

	this.maxDistance = Number.MAX_SAFE_INTEGER;
	this.minDistance = 1e-10;
	
	this.limitUp = 1.57;
	this.limitDown = -1.57;

	this.tempVector = new THREE.Vector3(0, 0, 0);
	this.tempMatrix = new THREE.Matrix4();

	this.updateControls();
}

EditorOrbitControls.UP = new THREE.Vector3(0, 1, 0);

EditorOrbitControls.prototype = Object.create(THREE.Object3D.prototype);

EditorOrbitControls.prototype.attach = function(camera)
{
	while(this.children.length > 0)
	{
		this.remove(this.children[0]);
	}
	this.add(camera);

	this.camera = camera;
};

EditorOrbitControls.prototype.reset = function()
{
	this.distance = 10;
	this.center.set(0, 0, 0);
	this.vector.set(-0.4, 0.40);
	this.updateControls();
};

EditorOrbitControls.prototype.focusObject = function(object)
{
	var box = ObjectUtils.calculateBoundingBox(object);
	box.applyMatrix4(object.matrixWorld);
	box.getCenter(this.center);

	var size = box.getSize(this.tempVector);
	this.distance = size.length() * 2.0;
	this.updateControls();
};

EditorOrbitControls.prototype.setOrientation = function(code)
{
	if(code === OrientationCube.Z_POS)
	{
		this.vector.set(Math.PI / 2, 0);
	}
	else if(code === OrientationCube.Z_NEG)
	{
		this.vector.set(-Math.PI / 2, 0);
	}
	else if(code === OrientationCube.X_POS)
	{
		this.vector.set(0, 0);
	}
	else if(code === OrientationCube.X_NEG)
	{
		this.vector.set(Math.PI, 0);
	}
	else if(code === OrientationCube.Y_POS)
	{
		this.vector.set(Math.PI, 1.57);
	}
	else if(code === OrientationCube.Y_NEG)
	{
		this.vector.set(Math.PI, -1.57);
	}

	this.updateControls();
};

EditorOrbitControls.prototype.update = function(mouse, keyboard)
{
	var needsUpdate = false;

	if(mouse.buttonPressed(Mouse.LEFT))
	{
		this.vector.y -= this.sensitivity * mouse.delta.y;
		this.vector.x -= this.sensitivity * mouse.delta.x;
		needsUpdate = true;
	}

	if(mouse.buttonPressed(Mouse.MIDDLE))
	{
		this.center.y += mouse.delta.y * this.sensitivity * this.distance;
		needsUpdate = true;
	}

	if(mouse.buttonPressed(Mouse.RIGHT))
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

	if(mouse.wheel !== 0)
	{
		this.distance += mouse.wheel * this.zoomSensitivity * this.position.distanceTo(this.center);
		needsUpdate = true;
	}
	
	//WASD movement
	if(Settings.editor.keyboardNavigation)
	{
		if(Editor.keyboard.keyPressed(Keyboard.S))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();

			this.center.x += direction.x * Settings.editor.keyboardNavigationSpeed;
			this.center.z += direction.z * Settings.editor.keyboardNavigationSpeed;
		}
		if(Editor.keyboard.keyPressed(Keyboard.W))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();

			this.center.x -= direction.x * Settings.editor.keyboardNavigationSpeed;
			this.center.z -= direction.z * Settings.editor.keyboardNavigationSpeed;
		}
		if(Editor.keyboard.keyPressed(Keyboard.A))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();
			direction.applyAxisAngle(SceneEditor.UP, 1.57);

			this.center.x -= direction.x * Settings.editor.keyboardNavigationSpeed;
			this.center.z -= direction.z * Settings.editor.keyboardNavigationSpeed;
		}
		if(Editor.keyboard.keyPressed(Keyboard.D))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();
			direction.applyAxisAngle(SceneEditor.UP, 1.57);

			this.center.x += direction.x * Settings.editor.keyboardNavigationSpeed;
			this.center.z += direction.z * Settings.editor.keyboardNavigationSpeed;
		}
	}
	
	if(needsUpdate === true)
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

	this.tempMatrix.lookAt(this.position, this.center, EditorOrbitControls.UP);
	this.quaternion.setFromRotationMatrix(this.tempMatrix);

	this.updateMatrixWorld(true);

	if(this.camera instanceof OrthographicCamera)
	{
		this.camera.size = this.distance;
		this.camera.updateProjectionMatrix();
	}
};
