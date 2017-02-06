"use strict";

//Key Constructor
function Key()
{
	this.pressed = false;
	this.just_pressed = false;
	this.just_released = false;
}

//Action List
Key.DOWN = -1;
Key.UP = 1;
Key.RESET = 0;

//Update Key status based new state
Key.prototype.update = function(action)
{
	this.just_pressed = false;
	this.just_released = false;

	if(action === Key.DOWN)
	{
		if(this.pressed ===  false)
		{
			this.just_pressed = true;
		}
		this.pressed = true;
	}
	else if(action === Key.UP)
	{
		if(this.pressed)
		{
			this.just_released = true;
		}
		this.pressed = false;
	}
	else if(action === Key.RESET)
	{
		this.just_released = false;
		this.just_pressed = false;
	}
}

//Set key status
Key.prototype.set = function(just_pressed, pressed, just_released)
{
	this.just_pressed = just_pressed;
	this.pressed = pressed;
	this.just_released = just_released;
}

//Reset key to default values
Key.prototype.reset = function()
{
	this.just_pressed = false;
	this.pressed = false;
	this.just_released = false;
}
