function Keyboard(){}

Keyboard.initialize = function()
{
	Keyboard.keys = [];

	for(var i = 0; i < 256; i++)
	{
		Keyboard.keys.push(new Key());
	}
}

Keyboard.update = function(key, action)
{
	if(key < 256)
	{
		Keyboard.keys[key].update(action);
	}
}

Keyboard.isKeyPressed = function(key)
{
	return key < 256 && Keyboard.keys[key].isPressed;
}

Keyboard.isKeyJustPressed = function(key)
{
	return key < 256 && Keyboard.keys[key].justPressed;
}

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
