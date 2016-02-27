//Mouse Atached to camera
function Mouse()
{
	//Mouse Position Relative to camera
	this.raw_mouse_pos = new THREE.Vector2(0,0);
	this.raw_mouse_movement = new THREE.Vector2(0,0);
	this.raw_mouse_pos_updated = false;

	this.pos = new THREE.Vector2(0,0);
	this.pos_diff = new THREE.Vector2(0,0);

	//Raw Mouse Buttons
	this.raw_keys = [];
	this.raw_keys[0] = new Key();
	this.raw_keys[1] = new Key();
	this.raw_keys[2] = new Key();

	//Mouse Buttons
	this.keys = [];
	this.keys[0] = new Key();
	this.keys[1] = new Key();
	this.keys[2] = new Key();
}

//Mouse Buttons
Mouse.LEFT = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;

//Mouse Configuration Values
Mouse.SENSITIVITY = 0.2;

//Functions Prototype
Mouse.prototype.buttonPressed = buttonPressed;
Mouse.prototype.buttonJustReleased = buttonJustReleased;
Mouse.prototype.buttonJustPressed = buttonJustPressed;
Mouse.prototype.updatePosition = updatePosition;
Mouse.prototype.updateKey = updateKey;
Mouse.prototype.toString = toString;
Mouse.prototype.update = update;

//Check if Mouse button is pressed
function buttonPressed(button)
{
	return this.keys[button].isPressed;
}

//Check if a mouse button was just pressed
function buttonJustPressed(button)
{
	return this.keys[button].justPressed;
}

//Check if a mouse button was just released
function buttonJustReleased(button)
{
	return this.keys[button].justReleased;
}

//Update Mouse Position
function updatePosition(x, y, x_diff, y_diff)
{
	this.raw_mouse_pos.set(x, y);
	this.raw_mouse_movement.x += x_diff;
	this.raw_mouse_movement.y += y_diff;
	this.raw_mouse_pos_updated = true;
}

//Update Mouse Key
function updateKey(button, action)
{
	this.raw_keys[button].update(action);
}

//Update Mouse State (Calculate position diff)
function update()
{
	//Update mouse keys state
	for(var i = 0; i < this.raw_keys.length; i++)
	{
		if(this.raw_keys[i].justPressed && this.keys[i].justPressed)
		{
			this.raw_keys[i].justPressed = false;
		}
		if(this.raw_keys[i].justReleased && this.keys[i].justReleased)
		{
			this.raw_keys[i].justReleased = false;
		}
		this.keys[i].set(this.raw_keys[i].justPressed, this.raw_keys[i].isPressed, this.raw_keys[i].justReleased);
	}

	//Update Mouse Position if needed
	if(this.raw_mouse_pos_updated)
	{
		this.pos_diff.x = this.raw_mouse_movement.x;
		this.pos_diff.y = this.raw_mouse_movement.y;
		this.raw_mouse_movement.set(0,0);

		this.pos.x = this.raw_mouse_pos.x;
		this.pos.y = this.raw_mouse_pos.y;
		this.raw_mouse_pos_updated = false;
	}
	else
	{
		this.pos_diff.x = 0;
		this.pos_diff.y = 0;
	}
}

//Return string with mouse position
function toString()
{
	return "Pos:" + this.pos.toString() + " Diff:" + this.pos_diff.toString() + "\n   Left: " + this.keys[0].toString() +
		"\n   Middle: " + this.keys[1].toString() + "\n   Right: " + this.keys[2].toString();
}

