"use strict";

function EditorOrthographicControls()
{
	THREE.Object3D.call(this);

	//Camera controls
	this.cameraRotation = new THREE.Vector2(0, 0);
	this.cameraLookAt = new THREE.Vector3(0, 0, 0);
	this.cameraDistance = 10;

	//Temporary variables
	this.tempVector2 = new THREE.Vector2();
	this.tempVector3 = new THREE.Vector3();
}

EditorOrthographicControls.prototype = Object.create(THREE.Object3D.prototype);

EditorOrthographicControls.prototype.attach = function(camera)
{
	while(this.children.length > 0)
	{
		this.remove(this.children[0]);
	}

	this.add(camera);
};

EditorOrthographicControls.prototype.reset = function()
{
	this.cameraRotation.set(Math.PI / 2, 0);
	this.cameraLookAt.set(0, 0, 0);
	this.cameraDistance = 100;
};

EditorOrthographicControls.prototype.focusObject = function(object)
{
	//TODO <ADD CODE HERE>
};

EditorOrthographicControls.prototype.setOrientation = function(code)
{
	if(code === OrientationCube.Z_POS)
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

	this.setCameraRotationOrbit(this.cameraRotation, this.cameraLookAt, this.cameraDistance, this.camera);
};

EditorOrthographicControls.prototype.update = function(mouse, keyboard)
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

EditorOrthographicControls.prototype.updateControls = function()
{
	this.cameraRotation.y -= Settings.editor.mouseLookSensitivity * this.mouse.delta.y;
	this.cameraRotation.x -= Settings.editor.mouseLookSensitivity * this.mouse.delta.x;

	//Limit Vertical Rotation to 90 degrees
	if(this.cameraRotation.y < -1.57)
	{
		this.cameraRotation.y = -1.57;
	}
	else if(this.cameraRotation.y > 1.57)
	{
		this.cameraRotation.y = 1.57;
	}

	setCameraRotationOrbit(this.cameraRotation, this.cameraLookAt, this.cameraDistance, this.camera);

	var setCameraRotationOrbit = function(cameraRotation, cameraLookAt, cameraDistance, camera)
	{
		var cos = Math.cos(cameraRotation.y);
		camera.position.set(cameraDistance * Math.cos(cameraRotation.x) * cos, cameraDistance * Math.sin(cameraRotation.y), cameraDistance * Math.sin(cameraRotation.x) * cos);
		camera.position.add(cameraLookAt);
		camera.lookAt(cameraLookAt);
	};
};