//Constructor
function Key()
{
	this.isPressed = false;
	this.justPressed = false;
	this.justReleased = false;
}

//Funtion Prototypes
Key.prototype.isPressed = isPressed;
Key.prototype.justPressed = justPressed;
Key.prototype.justReleased = justReleased;
Key.prototype.set = set;
Key.prototype.reset = reset;
Key.prototype.update = update;
Key.prototype.toString = toString;

//Action List
Key.KEY_DOWN = 0;
Key.KEY_UP = 1;

//Update Key status based new state
function update(action)
{
	this.justPressed = false;
	this.justReleased = false;

	if(action === Key.KEY_DOWN)
	{
		if(!this.isPressed)
		{
			this.justPressed = true;
		}
		this.isPressed = true;
	}
	else//if(action === Key.KEY_UP))
	{
		if(this.isPressed === true)
		{
			this.justReleased = true;
		}
		this.isPressed = false;
	}
}

//Check if key is currently pressed
function isPressed()
{
	return this.isPressed;
}

//Check if key was just pressed
function justPressed()
{
	return this.justPressed;
}

//Check if key was just released
function justReleased()
{
	return this.justReleased;
}

//Set key values manualy
function set(just_pressed, is_pressed, just_released)
{
	this.justPressed = just_pressed;
	this.isPressed = is_pressed;
	this.justReleased = just_released;
}

//Reset key to default values
function reset()
{
	this.justPressed = false;
	this.isPressed = false;
	this.justReleased = false;
}

//Returns string with key status
function toString()
{
	return "Pressed:" + this.isPressed + " JustPressed:" + this.justPressed + " JustReleased:" + this.justReleased;
}