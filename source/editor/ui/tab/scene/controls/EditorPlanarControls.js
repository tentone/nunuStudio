"use strict";

function EditorPlanarControls()
{
	THREE.Object3D.call(this);

	this.zoom = 10;
	this.center = new THREE.Vector3(0, 0, 0);
	this.orientation = new THREE.Vector2(-0.4, 0.4);

	this.camera = null;

	this.maxZoom = Number.MAX_SAFE_INTEGER;
	this.minZoom = 1e-10;
	
	this.limitUp = 1.57;
	this.limitDown = -1.57;

	this.tempVector = new THREE.Vector3(0, 0, 0);
	this.tempMatrix = new THREE.Matrix4();

	this.updateControls();
}

EditorPlanarControls.UP = new THREE.Vector3(0, 1, 0);

EditorPlanarControls.prototype = Object.create(THREE.Object3D.prototype);

EditorPlanarControls.prototype.attach = function(camera)
{
	while(this.children.length > 0)
	{
		this.remove(this.children[0]);
	}
	this.add(camera);

	this.camera = camera;
	this.updateControls();
};

EditorPlanarControls.prototype.reset = function()
{
	this.zoom = 10;
	this.center.set(0, 0, 0);
	this.orientation.set(-0.4, 0.4);
	this.updateControls();
};

EditorPlanarControls.prototype.focusObject = function(object)
{
	var box = ObjectUtils.calculateBoundingBox(object);
	box.applyMatrix4(object.matrixWorld);
	box.getCenter(this.center);

	var size = box.getSize(this.tempVector).length();

	if(this.camera instanceof THREE.PerspectiveCamera)
	{
		this.zoom = (size / 2) / Math.tan(THREE.Math.DEG2RAD * 0.5 * this.camera.fov);
	}
	else
	{
		this.zoom = size;
	}

	this.updateControls();
};

EditorPlanarControls.prototype.setOrientation = function(code)
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

EditorPlanarControls.prototype.update = function(mouse, keyboard)
{
	var needsUpdate = false;

	if(mouse.buttonPressed(Mouse.LEFT))
	{
		this.orientation.y += Settings.editor.mouseLookSensitivity * (Settings.editor.invertNavigation ? mouse.delta.y : -mouse.delta.y);
		this.orientation.x -= Settings.editor.mouseLookSensitivity * mouse.delta.x;

		needsUpdate = true;
	}

	if(mouse.buttonPressed(Mouse.MIDDLE))
	{
		this.center.y += mouse.delta.y * Settings.editor.mouseLookSensitivity * this.zoom;
		needsUpdate = true;
	}

	if(mouse.buttonPressed(Mouse.RIGHT))
	{
		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();

		var y = mouse.delta.y * Settings.editor.mouseLookSensitivity * this.zoom;
		this.center.x -= direction.x * y;
		this.center.z -= direction.z * y;

		direction.applyAxisAngle(EditorPlanarControls.UP, 1.57);

		var x = mouse.delta.x * Settings.editor.mouseLookSensitivity * this.zoom;
		this.center.x -= direction.x * x;
		this.center.z -= direction.z * x;

		needsUpdate = true;
	}

	if(mouse.wheel !== 0)
	{
		this.zoom += mouse.wheel * this.position.distanceTo(this.center) * Settings.editor.mouseWheelSensitivity;
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
			direction.applyAxisAngle(EditorPlanarControls.UP, 1.57);

			this.center.x -= direction.x * Settings.editor.keyboardNavigationSpeed;
			this.center.z -= direction.z * Settings.editor.keyboardNavigationSpeed;
		}
		if(Editor.keyboard.keyPressed(Keyboard.D))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();
			direction.applyAxisAngle(EditorPlanarControls.UP, 1.57);

			this.center.x += direction.x * Settings.editor.keyboardNavigationSpeed;
			this.center.z += direction.z * Settings.editor.keyboardNavigationSpeed;
		}
	}
	
	if(needsUpdate === true)
	{
		this.updateControls();
	}
};

EditorPlanarControls.prototype.updateControls = function()
{
	if(this.orientation.y < this.limitDown)
	{
		this.orientation.y = this.limitDown;
	}
	else if(this.orientation.y > this.limitUp)
	{
		this.orientation.y = this.limitUp;
	}

	if(this.zoom < this.minZoom)
	{
		this.zoom = this.minZoom;
	}
	else if(this.zoom > this.maxZoom)
	{
		this.zoom = this.maxZoom;
	}

	var cos = this.zoom * Math.cos(this.orientation.y);
	this.position.set(Math.cos(this.orientation.x) * cos, this.zoom * Math.sin(this.orientation.y), Math.sin(this.orientation.x) * cos);
	this.position.add(this.center);

	this.tempMatrix.lookAt(this.position, this.center, EditorPlanarControls.UP);
	this.quaternion.setFromRotationMatrix(this.tempMatrix);

	this.updateMatrixWorld(true);

	if(this.camera instanceof OrthographicCamera)
	{
		this.camera.size = this.zoom;
		this.camera.updateProjectionMatrix();
	}
};
