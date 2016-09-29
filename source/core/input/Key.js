"use strict";

//Key Constructor
function Key()
{
	this.isPressed = false;
	this.justPressed = false;
	this.justReleased = false;
}

//Action List
Key.KEY_DOWN = -1;
Key.KEY_UP = 1;
Key.KEY_RESET = 0;

//Update Key status based new state
Key.prototype.update = function(action)
{
	this.justPressed = false;
	this.justReleased = false;

	if(action === Key.KEY_DOWN)
	{
		if(this.isPressed ===  false)
		{
			this.justPressed = true;
		}
		this.isPressed = true;
	}
	else if(action === Key.KEY_UP)
	{
		if(this.isPressed)
		{
			this.justReleased = true;
		}
		this.isPressed = false;
	}
	else if(action === Key.KEY_RESET)
	{
		this.justReleased = false;
		this.justPressed = false;
	}
}

//Set key status
Key.prototype.set = function(just_pressed, is_pressed, just_released)
{
	this.justPressed = just_pressed;
	this.isPressed = is_pressed;
	this.justReleased = just_released;
}

//Reset key to default values
Key.prototype.reset = function()
{
	this.justPressed = false;
	this.isPressed = false;
	this.justReleased = false;
}

//Returns string with key status
Key.prototype.toString = function()
{
	return "Pressed:" + this.isPressed + " JustPressed:" + this.justPressed + " JustReleased:" + this.justReleased;
}