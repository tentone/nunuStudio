function Mouse(){}

//Mouse Atached to camera
Mouse.initialize = function()
{
	//Mouse Position Relative to camera
	Mouse.raw_mouse_pos = new THREE.Vector2(0,0);
	Mouse.raw_mouse_movement = new THREE.Vector2(0,0);
	Mouse.raw_mouse_pos_updated = false;

	Mouse.pos = new THREE.Vector2(0,0);
	Mouse.pos_diff = new THREE.Vector2(0,0);

	//Raw Mouse Buttons
	Mouse.raw_keys = [];
	Mouse.raw_keys[0] = new Key();
	Mouse.raw_keys[1] = new Key();
	Mouse.raw_keys[2] = new Key();

	//Mouse Buttons
	Mouse.keys = [];
	Mouse.keys[0] = new Key();
	Mouse.keys[1] = new Key();
	Mouse.keys[2] = new Key();
}

//Mouse Buttons
Mouse.LEFT = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;

//Mouse Configuration Values
Mouse.SENSITIVITY = 0.2;

//Check if Mouse button is pressed
Mouse.buttonPressed = function(button)
{
	return Mouse.keys[button].isPressed;
}

//Check if a mouse button was just pressed
Mouse.buttonJustPressed = function(button)
{
	return Mouse.keys[button].justPressed;
}

//Check if a mouse button was just released
Mouse.buttonJustReleased = function(button)
{
	return Mouse.keys[button].justReleased;
}

//Update Mouse Position
Mouse.updatePosition = function(x, y, x_diff, y_diff)
{
	Mouse.raw_mouse_pos.set(x, y);
	Mouse.raw_mouse_movement.x += x_diff;
	Mouse.raw_mouse_movement.y += y_diff;
	Mouse.raw_mouse_pos_updated = true;
}

//Update Mouse Key
Mouse.updateKey = function(button, action)
{
	Mouse.raw_keys[button].update(action);
}

//Update Mouse State (Calculate position diff)
Mouse.update = function()
{
	//Update mouse keys state
	for(var i = 0; i < Mouse.raw_keys.length; i++)
	{
		if(Mouse.raw_keys[i].justPressed && Mouse.keys[i].justPressed)
		{
			Mouse.raw_keys[i].justPressed = false;
		}
		if(Mouse.raw_keys[i].justReleased && Mouse.keys[i].justReleased)
		{
			Mouse.raw_keys[i].justReleased = false;
		}
		Mouse.keys[i].set(Mouse.raw_keys[i].justPressed, Mouse.raw_keys[i].isPressed, Mouse.raw_keys[i].justReleased);
	}

	//Update Mouse Position if needed
	if(Mouse.raw_mouse_pos_updated)
	{
		Mouse.pos_diff.x = Mouse.raw_mouse_movement.x;
		Mouse.pos_diff.y = Mouse.raw_mouse_movement.y;
		Mouse.raw_mouse_movement.set(0,0);

		Mouse.pos.x = Mouse.raw_mouse_pos.x;
		Mouse.pos.y = Mouse.raw_mouse_pos.y;
		Mouse.raw_mouse_pos_updated = false;
	}
	else
	{
		Mouse.pos_diff.x = 0;
		Mouse.pos_diff.y = 0;
	}
}

//Return string with mouse position
Mouse.toString = function()
{
	return "Pos:" + Mouse.pos.toString() + " Diff:" + Mouse.pos_diff.toString() + "\n   Left: " + Mouse.keys[0].toString() +
		"\n   Middle: " + Mouse.keys[1].toString() + "\n   Right: " + Mouse.keys[2].toString();
}

