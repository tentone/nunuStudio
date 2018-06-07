"use strict";

function EditorPlanarControls(mode)
{
	EditorOrbitControls.call(this);

	this.mode = mode !== undefined ? mode : Settings.PLANAR_LEFT;
}

EditorPlanarControls.prototype = Object.create(EditorOrbitControls.prototype);

EditorPlanarControls.prototype.reset = function()
{
	this.distance = 10;
	this.center.set(0, 0, 0);
	this.orientation.set(0.0, 0.0);
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

	if(mouse.buttonPressed(Mouse.RIGHT))
	{
		this.center.y += mouse.delta.y * Editor.settings.editor.mouseLookSensitivity * this.distance;

		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();
		direction.applyAxisAngle(EditorOrbitControls.UP, 1.57);

		var x = mouse.delta.x * Editor.settings.editor.mouseLookSensitivity * this.distance;
		this.center.x -= direction.x * x;
		this.center.z -= direction.z * x;

		needsUpdate = true;
	}

	if(mouse.wheel !== 0)
	{
		var direction = this.getWorldDirection(this.tempVector);
		direction.y = 0;
		direction.normalize();

		var y = mouse.wheel * Editor.settings.editor.mouseWheelSensitivity * this.distance;
		this.center.x += direction.x * y;
		this.center.z += direction.z * y;
		needsUpdate = true;
	}
	
	//WASD movement
	if(Editor.settings.editor.keyboardNavigation)
	{
		if(Editor.keyboard.keyPressed(Keyboard.W))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();

			this.center.x -= direction.x * Editor.settings.editor.keyboardNavigationSpeed;
			this.center.z -= direction.z * Editor.settings.editor.keyboardNavigationSpeed;
			needsUpdate = true;
		}
		if(Editor.keyboard.keyPressed(Keyboard.A))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();
			direction.applyAxisAngle(EditorOrbitControls.UP, 1.57);

			this.center.x -= direction.x * Editor.settings.editor.keyboardNavigationSpeed;
			this.center.z -= direction.z * Editor.settings.editor.keyboardNavigationSpeed;
			needsUpdate = true;
		}
		if(Editor.keyboard.keyPressed(Keyboard.S))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();

			this.center.x += direction.x * Editor.settings.editor.keyboardNavigationSpeed;
			this.center.z += direction.z * Editor.settings.editor.keyboardNavigationSpeed;
			needsUpdate = true;
		}
		if(Editor.keyboard.keyPressed(Keyboard.D))
		{
			var direction = this.getWorldDirection(this.tempVector);
			direction.y = 0;
			direction.normalize();
			direction.applyAxisAngle(EditorOrbitControls.UP, 1.57);

			this.center.x += direction.x * Editor.settings.editor.keyboardNavigationSpeed;
			this.center.z += direction.z * Editor.settings.editor.keyboardNavigationSpeed;
			needsUpdate = true;
		}
	}
	
	if(needsUpdate === true)
	{
		this.updateControls();
	}
};
