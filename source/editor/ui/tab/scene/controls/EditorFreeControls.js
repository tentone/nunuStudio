"use strict";

function EditorFreeControls()
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

EditorFreeControls.prototype = Object.create(THREE.Object3D.prototype);

EditorFreeControls.prototype.reset = function()
{
	this.cameraRotation.set(Math.PI, 0);
	this.cameraLookAt.set(0, 0, 0);
	this.cameraDistance = 10;
};

EditorFreeControls.prototype.focusObject = function(object)
{
	//TODO <ADD CODE HERE>
};

EditorFreeControls.prototype.setOrientation = function(code)
{
	if(code === OrientationCube.Z_POS)
	{
		this.cameraRotation.set(Math.PI, 0);
	}
	else if(code === OrientationCube.Z_NEG)
	{
		this.cameraRotation.set(0, 0);
	}
	else if(code === OrientationCube.X_POS)
	{
		this.cameraRotation.set(-Math.PI / 2, 0);
	}
	else if(code === OrientationCube.X_NEG)
	{
		this.cameraRotation.set(Math.PI / 2, 0);
	}
	else if(code === OrientationCube.Y_POS)
	{
		this.cameraRotation.set(Math.PI, -1.57);
	}
	else if(code === OrientationCube.Y_NEG)
	{
		this.cameraRotation.set(Math.PI, 1.57);
	}

	this.setCameraRotation(this.cameraRotation, this.camera);
};

EditorFreeControls.prototype.update = function(mouse, keyboard)
{
	//Look camera
	if(this.mouse.buttonPressed(Mouse.LEFT))
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
		

		//Limit Vertical Rotation to 90 degrees
		if(this.cameraRotation.y < -1.57)
		{
			this.cameraRotation.y = -1.57;
		}
		else if(this.cameraRotation.y > 1.57)
		{
			this.cameraRotation.y = 1.57;
		}

		this.setCameraRotation(this.cameraRotation, this.camera);
	}

	//Move Camera on X and Z
	if(this.mouse.buttonPressed(Mouse.RIGHT))
	{
		//Move speed
		var speed = this.camera.position.distanceTo(SceneEditor.ZERO) * Settings.editor.mouseMoveSpeed;
		
		if(speed < 0.01)
		{
			speed = 0.01;
		}

		//Move Camera Front and Back
		var angleCos = Math.cos(this.cameraRotation.x);
		var angleSin = Math.sin(this.cameraRotation.x);
		this.camera.position.z += this.mouse.delta.y * speed * angleCos;
		this.camera.position.x += this.mouse.delta.y * speed * angleSin;

		//Move Camera Lateral
		var angleCos = Math.cos(this.cameraRotation.x + MathUtils.pid2);
		var angleSin = Math.sin(this.cameraRotation.x + MathUtils.pid2);
		this.camera.position.z += this.mouse.delta.x * speed * angleCos;
		this.camera.position.x += this.mouse.delta.x * speed * angleSin;
	}
	
	//Move Camera on Y
	if(this.mouse.buttonPressed(Mouse.MIDDLE))
	{
		this.camera.position.y += this.mouse.delta.y * Settings.editor.mouseMoveSpeed * 100;
	}

	//Move in camera direction using mouse scroll
	if(this.mouse.wheel !== 0)
	{
		//Move speed
		var speed = this.mouse.wheel * this.camera.position.distanceTo(SceneEditor.ZERO) * Settings.editor.mouseWheelSensitivity;

		//Limit zoom speed
		if(speed < 0 && speed > -0.02)
		{
			speed = -0.02;
		}
		else if(speed > 0 && speed < 0.02)
		{
			speed = 0.02;
		}

		//Move camera
		var direction = this.camera.getWorldDirection(this.tempVector3);
		direction.multiplyScalar(speed);
		this.camera.position.sub(direction);
	}

	//WASD movement
	if(Settings.editor.keyboardNavigation)
	{
		if(Editor.keyboard.keyPressed(Keyboard.W))
		{
			var direction = this.camera.getWorldDirection(this.tempVector3);
			direction.multiplyScalar(Settings.editor.keyboardNavigationSpeed);
			this.camera.position.add(direction);
		}
		if(Editor.keyboard.keyPressed(Keyboard.S))
		{
			var direction = this.camera.getWorldDirection(this.tempVector3);
			direction.multiplyScalar(Settings.editor.keyboardNavigationSpeed);
			this.camera.position.sub(direction);
		}
		if(Editor.keyboard.keyPressed(Keyboard.A))
		{
			this.tempVector3.set(Math.sin(this.cameraRotation.x - 1.57), 0, Math.cos(this.cameraRotation.x - 1.57));
			this.tempVector3.normalize();
			this.tempVector3.multiplyScalar(Settings.editor.keyboardNavigationSpeed);
			this.camera.position.sub(this.tempVector3);
		}
		if(Editor.keyboard.keyPressed(Keyboard.D))
		{
			this.tempVector3.set(Math.sin(this.cameraRotation.x + 1.57), 0, Math.cos(this.cameraRotation.x + 1.57));
			this.tempVector3.normalize();
			this.tempVector3.multiplyScalar(Settings.editor.keyboardNavigationSpeed);
			this.camera.position.sub(this.tempVector3);
		}
	}
};

EditorFreeControls.prototype.updateControls = function()
{

};