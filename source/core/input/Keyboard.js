"use strict";

function Keyboard()
{
	this.keys = [];
	this.actions = [];

	//Initialize Keys
	for(var i = 0; i < 256; i++)
	{
		this.keys.push(new Key());
	}

	//Events
	this.events = [];

	//Actions pointer
	var actions = this.actions;

	//Key down
	this.events.push([window, "keydown", function(event)
	{
		actions.push(event.keyCode);
		actions.push(Key.DOWN);
	}]);

	//Key up
	this.events.push([window, "keyup", function(event)
	{
		actions.push(event.keyCode);
		actions.push(Key.UP);
	}]);

	//Initialize events
	for(var i = 0; i < this.events.length; i++)
	{
		var event = this.events[i];
		event[0].addEventListener(event[1], event[2]);
	}
}

//Prototype
Keyboard.prototype = Keyboard;

//Update key flags syncronously
Keyboard.update = function()
{
	var end = 0;

	while(this.actions.length > end)
	{
		var key = this.actions.shift();
		var action = this.actions.shift();

		this.keys[key].update(action);

		if(this.keys[key].justReleased || this.keys[key].justPressed)
		{
			this.actions.push(key);
			this.actions.push(Key.RESET);
			end += 2;
		}
	}
}

//Reset keyboard status
Keyboard.reset = function()
{
	//Clear actions array
	this.actions = [];

	//Reset all keys
	for(var i = 0; i < this.keys.length; i++)
	{
		this.keys[i].reset();
	}
}

//Check if a key is pressed
Keyboard.keyPressed = function(key)
{
	return this.keys[key].pressed;
}

//Check is a key as just pressed
Keyboard.keyJustPressed = function(key)
{
	return this.keys[key].justPressed;
}

//Check if a key was just released
Keyboard.keyJustReleased = function(key)
{
	return this.keys[key].justReleased;
}

//Dispose keyboard events
Keyboard.dispose = function()
{
	for(var i = 0; i < this.events.length; i++)
	{
		var event = this.events[i];
		event[0].removeEventListener(event[1], event[2]);
	}
}

//Key codes
Keyboard.TAB = 9;
Keyboard.ENTER = 13;
Keyboard.SHIFT = 16;
Keyboard.CTRL = 17;
Keyboard.ALT = 18;
Keyboard.CAPS_LOCK = 20;
Keyboard.ESC = 27;
Keyboard.SPACEBAR = 32;
Keyboard.PAGE_UP = 33;
Keyboard.PAGE_DOWN = 34;
Keyboard.END = 35;
Keyboard.HOME = 36;
Keyboard.INSERT = 45;
Keyboard.DEL = 46;

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;

Keyboard.NUM0 = 48;
Keyboard.NUM1 = 49;
Keyboard.NUM2 = 50;
Keyboard.NUM3 = 51;
Keyboard.NUM4 = 52;
Keyboard.NUM5 = 53;
Keyboard.NUM6 = 54;
Keyboard.NUM7 = 55;
Keyboard.NUM8 = 56;
Keyboard.NUM9 = 57;

Keyboard.A = 65;
Keyboard.B = 66;
Keyboard.C = 67;
Keyboard.D = 68;
Keyboard.E = 69;
Keyboard.F = 70;
Keyboard.G = 71;
Keyboard.H = 72;
Keyboard.I = 73;
Keyboard.J = 74;
Keyboard.K = 75;
Keyboard.L = 76;
Keyboard.M = 77;
Keyboard.N = 78;
Keyboard.O = 79;
Keyboard.P = 80;
Keyboard.Q = 81;
Keyboard.R = 82;
Keyboard.S = 83;
Keyboard.T = 84;
Keyboard.U = 85;
Keyboard.V = 86;
Keyboard.W = 87;
Keyboard.X = 88;
Keyboard.Y = 89;
Keyboard.Z = 90;

Keyboard.F1 = 112;
Keyboard.F2 = 113;
Keyboard.F3 = 114;
Keyboard.F4 = 115;
Keyboard.F5 = 116;
Keyboard.F6 = 117;
Keyboard.F7 = 118;
Keyboard.F8 = 119;
Keyboard.F9 = 120;
Keyboard.F10 = 121;
Keyboard.F11 = 122;
Keyboard.F12 = 123;
