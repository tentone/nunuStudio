"use strict";

function EditorPlanarControls()
{
	THREE.Object3D.call(this);

	this.camera = null;

	this.orientation = new THREE.Vector2(0, 0);
	this.center = new THREE.Vector3(0, 0, 0);
	this.distance = 10;
}

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
	this.orientation.set(0, 0);
	this.center.set(0, 0, 0);
	this.distance = 10;
	
	this.updateControls();
};

EditorPlanarControls.prototype.focusObject = function(object)
{
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

	this.setCameraRotationOrbit(this.orientation, this.center, this.distance, this.camera);
};

EditorPlanarControls.prototype.update = function(mouse, keyboard)
{
	//Move camera on y / x
	if(this.mouse.buttonPressed(Mouse.RIGHT))
	{
		var ratio = this.camera.size / this.canvas.width * 2;
		var x = this.mouse.delta.x * ratio;

		this.camera.position.x -= this.mouse.delta.x * ratio;
		this.camera.position.y += this.mouse.delta.y * ratio;
	}

	//Rotate camera
	if(this.mouse.buttonPressed(Mouse.MIDDLE))
	{
		this.updateOrthographicCameraRotation();
	}

	//Camera zoom
	if(this.mouse.wheel !== 0)
	{
		this.camera.size += this.mouse.wheel * this.camera.size / 1000;
		this.camera.updateProjectionMatrix();
	}
};

EditorPlanarControls.prototype.updateControls = function()
{
	this.orientation.y -= Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
	this.orientation.x -= Settings.editor.mouseLookSensitivity * this.mouse.delta.x;

	//Limit Vertical Rotation to 90 degrees
	if(this.orientation.y < -1.57)
	{
		this.orientation.y = -1.57;
	}
	else if(this.orientation.y > 1.57)
	{
		this.orientation.y = 1.57;
	}

	setCameraRotationOrbit(this.orientation, this.center, this.distance, this.camera);

	var setCameraRotationOrbit = function(orientation, center, distance, camera)
	{
		var cos = Math.cos(orientation.y);
		camera.position.set(distance * Math.cos(orientation.x) * cos, distance * Math.sin(orientation.y), distance * Math.sin(orientation.x) * cos);
		camera.position.add(center);
		camera.lookAt(center);
	};
};