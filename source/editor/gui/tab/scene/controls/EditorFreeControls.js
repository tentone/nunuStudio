"use strict";

function EditorFreeControls()
{
	EditorControls.call(this);

	this.orientation = new THREE.Vector2();

	this.camera = null;

	this.temp = new THREE.Vector3();

	this.reset();
	this.updateControls();
}

EditorFreeControls.prototype = Object.create(EditorControls.prototype);

EditorFreeControls.ZERO = new THREE.Vector3(0, 0, 0);

EditorFreeControls.prototype.reset = function()
{
	this.orientation.set(0.5, 0.5);
	this.position.set(5, 4.8, 7.4);
	this.updateControls();
};

EditorFreeControls.prototype.focusObject = function(object)
{
	var box = ObjectUtils.calculateBoundingBox(object);
	box.applyMatrix4(object.matrixWorld);
	var size = box.getSize(new THREE.Vector3()).length();

	//var center = box.getCenter(new THREE.Vector3());

	var distance = this.getWorldPosition(new THREE.Vector3()).distanceTo(object.getWorldPosition(new THREE.Vector3()));

	var direction = object.position.clone();
	direction.sub(this.position);
	direction.normalize();
	direction.multiplyScalar(distance - size);
	
	this.position.add(direction);
	//this.lookAt(center);

	this.updateControls();
};

EditorFreeControls.prototype.setOrientation = function(code)
{
	if(code === OrientationCube.Z_POS)
	{
		this.orientation.set(0, 0);
	}
	else if(code === OrientationCube.Z_NEG)
	{
		this.orientation.set(Math.PI, 0);
	}
	else if(code === OrientationCube.X_POS)
	{
		this.orientation.set(Math.PI / 2, 0);
	}
	else if(code === OrientationCube.X_NEG)
	{
		this.orientation.set(-Math.PI / 2, 0);
	}
	else if(code === OrientationCube.Y_POS)
	{
		this.orientation.set(Math.PI, +1.57);
	}
	else if(code === OrientationCube.Y_NEG)
	{
		this.orientation.set(Math.PI, -1.57);
	}

	this.updateControls();
};

EditorFreeControls.prototype.update = function(mouse, keyboard)
{
	var needsUpdate = false;

	//Look camera
	if(mouse.buttonPressed(Mouse.LEFT))
	{
		this.orientation.y -= Editor.settings.editor.mouseLookSensitivity * (Editor.settings.editor.invertNavigation ? mouse.delta.y : -mouse.delta.y);
		this.orientation.x -= Editor.settings.editor.mouseLookSensitivity * mouse.delta.x;

		//Limit Vertical Rotation to 90 degrees
		if(this.orientation.y < -1.57)
		{
			this.orientation.y = -1.57;
		}
		else if(this.orientation.y > 1.57)
		{
			this.orientation.y = 1.57;
		}

		needsUpdate = true;
	}

	//Move Camera on X and Z
	if(mouse.buttonPressed(Mouse.RIGHT))
	{
		//Move speed
		var speed = this.position.distanceTo(EditorFreeControls.ZERO) * Editor.settings.editor.mouseMoveSpeed;
		if(speed < 0.01)
		{
			speed = 0.01;
		}

		//Move Camera Front and Back
		var angleCos = Math.cos(this.orientation.x);
		var angleSin = Math.sin(this.orientation.x);
		this.position.z -= mouse.delta.y * speed * angleCos;
		this.position.x -= mouse.delta.y * speed * angleSin;

		//Move Camera Lateral
		var angleCos = Math.cos(this.orientation.x + MathUtils.pid2);
		var angleSin = Math.sin(this.orientation.x + MathUtils.pid2);
		this.position.z -= mouse.delta.x * speed * angleCos;
		this.position.x -= mouse.delta.x * speed * angleSin;

		needsUpdate = true;
	}
	
	//Move Camera on Y
	if(mouse.buttonPressed(Mouse.MIDDLE))
	{
		this.position.y += mouse.delta.y * Editor.settings.editor.mouseMoveSpeed * 100;

		needsUpdate = true;
	}

	//Move in camera direction using mouse scroll
	if(mouse.wheel !== 0)
	{
		//Move speed
		var speed = mouse.wheel * this.position.distanceTo(EditorFreeControls.ZERO) * Editor.settings.editor.mouseWheelSensitivity;

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
		var direction = this.getWorldDirection(this.temp);
		direction.multiplyScalar(speed);
		this.position.add(direction);

		needsUpdate = true;
	}

	//WASD movement
	if(Editor.settings.editor.keyboardNavigation)
	{
		if(keyboard.keyPressed(Keyboard.S))
		{
			var direction = this.getWorldDirection(this.temp);
			direction.multiplyScalar(Editor.settings.editor.keyboardNavigationSpeed);
			this.position.add(direction);
			needsUpdate = true;
		}
		if(keyboard.keyPressed(Keyboard.W))
		{
			var direction = this.getWorldDirection(this.temp);
			direction.multiplyScalar(Editor.settings.editor.keyboardNavigationSpeed);
			this.position.sub(direction);
			needsUpdate = true;
		}
		if(keyboard.keyPressed(Keyboard.D))
		{
			this.temp.set(Math.sin(this.orientation.x - 1.57), 0, Math.cos(this.orientation.x - 1.57));
			this.temp.normalize();
			this.temp.multiplyScalar(Editor.settings.editor.keyboardNavigationSpeed);
			this.position.sub(this.temp);
			needsUpdate = true;
		}
		if(keyboard.keyPressed(Keyboard.A))
		{
			this.temp.set(Math.sin(this.orientation.x + 1.57), 0, Math.cos(this.orientation.x + 1.57));
			this.temp.normalize();
			this.temp.multiplyScalar(Editor.settings.editor.keyboardNavigationSpeed);
			this.position.sub(this.temp);
			needsUpdate = true;
		}
	}

	if(needsUpdate)
	{
		this.updateControls();
	}
};

EditorFreeControls.prototype.updateControls = function()
{
	var cos = Math.cos(this.orientation.y);
	this.temp.set(Math.sin(this.orientation.x)*cos, Math.sin(this.orientation.y), Math.cos(this.orientation.x)*cos);
	this.temp.add(this.position);

	this.lookAt(this.temp);

	this.updateMatrixWorld(true);
};
