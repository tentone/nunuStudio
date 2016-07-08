"use strict";

function Keyboard(){}

//Initialize keyboard
Keyboard.initialize = function()
{
	Keyboard.keys = [];
	Keyboard.actions = [];

	//Keyboard keys
	for(var i = 0; i < 256; i++)
	{
		Keyboard.keys.push(new Key());
	}

	//Keyboard OnKeyDown Event
	document.onkeydown = function(event)
	{
		Keyboard.actions.push(event.keyCode);
		Keyboard.actions.push(Key.KEY_DOWN);
	}

	//Keyboard OnKeyUp Event
	document.onkeyup = function(event)
	{
		Keyboard.actions.push(event.keyCode);
		Keyboard.actions.push(Key.KEY_UP);
	}
}

//Update key flags syncronously
Keyboard.update = function()
{
	var end = 0;

	while(Keyboard.actions.length > end)
	{
		var key = Keyboard.actions.shift();
		var action = Keyboard.actions.shift();

		Keyboard.keys[key].update(action);

		if(Keyboard.keys[key].justReleased || Keyboard.keys[key].justPressed)
		{
			Keyboard.actions.push(key);
			Keyboard.actions.push(Key.KEY_RESET);
			end += 2;
		}
	}
}

//Reset keyboard status
Keyboard.reset = function()
{
	//Clear actions array
	Keyboard.actions = [];

	//Reset all keys
	for(var i = 0; i < Keyboard.keys.length; i++)
	{
		Keyboard.keys[i].reset();
	}
}

//Check if a key is pressed
Keyboard.isKeyPressed = function(key)
{
	return key < 256 && Keyboard.keys[key].isPressed;
}

//Check is a key as just pressed
Keyboard.isKeyJustPressed = function(key)
{
	return key < 256 && Keyboard.keys[key].justPressed;
}

//Check if a key was just released
Keyboard.isKeyJustReleased = function(key)
{
	return key < 256 && Keyboard.keys[key].justReleased;
}

//Some Keycodes
Keyboard.ENTER = 13;
Keyboard.SHIFT = 16;
Keyboard.ESC = 27;
Keyboard.SPACEBAR = 32;
Keyboard.CTRL = 17;
Keyboard.DEL = 46;
Keyboard.END = 35;
Keyboard.HOME = 36;

Keyboard.PAGE_UP = 33;
Keyboard.PAGE_DOWN = 34;

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