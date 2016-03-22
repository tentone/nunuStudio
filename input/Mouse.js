function Mouse(){}

//Mouse Atached to camera
Mouse.initialize = function()
{
	//Mouse Position Relative to camera
	Mouse.raw_pos = new THREE.Vector2(0,0);
	Mouse.raw_movement = new THREE.Vector2(0,0);
	Mouse.raw_pos_updated = false;
	Mouse.raw_wheel = 0;
	Mouse.raw_wheel_updated = false;

	//Mouse position and scroll speed
	Mouse.pos = new THREE.Vector2(0,0);
	Mouse.pos_diff = new THREE.Vector2(0,0);
	Mouse.wheel = 0;

	//Calculate coordinates relative to canvas
	Mouse.canvas = null;

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

	//Mouse Wheel (Chorme only)
	document.onmousewheel = function(event)
	{
		Mouse.raw_wheel = event.deltaY;
		Mouse.raw_wheel_updated = true;
	}

	//Mouse Move Position
	document.onmousemove = function(event)
	{
		if(Mouse.canvas !== null)
		{
			var rect = Mouse.canvas.getBoundingClientRect();
			Mouse.updatePosition(event.clientX - rect.left, event.clientY - rect.top, event.movementX, event.movementY);
		}
		else
		{
			Mouse.updatePosition(event.clientX, event.clientY, event.movementX, event.movementY);
		}
	}

	//Mouse Button Down
	document.onmousedown = function(event)
	{
		Mouse.updateKey(event.which-1, Key.KEY_DOWN);
	}

	//Mouse Button Up
	document.onmouseup = function(event)
	{
		Mouse.updateKey(event.which-1, Key.KEY_UP);
	}
}

//Mouse Buttons
Mouse.LEFT = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;

//Mouse Configuration Values
Mouse.SENSITIVITY = 0.2;

//Check if mouse is inside canvas
Mouse.insideCanvas = function()
{
	if(Mouse.canvas === null)
	{
		return false;
	}
	
	var rect = Mouse.canvas.getBoundingClientRect();
	return (Mouse.pos.x > 0 && Mouse.pos.y > 0 && Mouse.pos.x < rect.width && Mouse.pos.y < rect.height); 
}

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
	Mouse.raw_pos.set(x, y);
	Mouse.raw_movement.x += x_diff;
	Mouse.raw_movement.y += y_diff;
	Mouse.raw_pos_updated = true;
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

	if(Mouse.raw_wheel_updated)
	{
		Mouse.wheel = Mouse.raw_wheel;
		Mouse.raw_wheel_updated = false;
	}
	else
	{
		Mouse.wheel = 0;
	}

	//Update Mouse Position if needed
	if(Mouse.raw_pos_updated)
	{
		Mouse.pos_diff.x = Mouse.raw_movement.x;
		Mouse.pos_diff.y = Mouse.raw_movement.y;
		Mouse.raw_movement.set(0,0);

		Mouse.pos.x = Mouse.raw_pos.x;
		Mouse.pos.y = Mouse.raw_pos.y;

		Mouse.raw_pos_updated = false;
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
	return "Pos:" + Mouse.pos.x + "," + Mouse.pos.y + " Diff:" + Mouse.pos_diff.toString() + "\n   Left: " + Mouse.keys[0].toString() +
		"\n   Middle: " + Mouse.keys[1].toString() + "\n   Right: " + Mouse.keys[2].toString();
}

