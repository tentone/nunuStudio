"use strict";

/**
 * Gamepad provides basic support for gamepads.
 *
 * Some gamepads require a button press to being detected.
 * 
 * Gamepad implementation across browsers is still fragmented, every browser implements it a bit differently, so test it on every target before deploying an application using it.
 *
 * For more information about the Gamepad API state take look at the W3C Gamepad API page https://www.w3.org/TR/gamepad/.
 * 
 * @class Gamepad
 * @module Input
 * @constructor
 */
function Gamepad()
{
	this.vendor = -1;
	this.product = -1;
	this.connected = false;

	this.gamepad = null;
	this.buttons = [];

	var gamepads = navigator.getGamepads();
	for(var i = 0; i < gamepads.length; i++)
	{
		if(gamepads[i] !== null)
		{
			this.setGamepad(gamepads[i]);
			break;
		}
	}
	
	if(this.gamepad === null)
	{
		console.warn("nunuStudio: No gamepad found");
	}
}

/**
 * Set which gamepad should be used by this Gamepad instance.
 *
 * Can be used to override the gamepad attached to this object and enable multiple gamepad support.
 * 
 * @param {Object} Browser gamepad object.
 * @method setGamepad
 */
Gamepad.prototype.setGamepad = function(gamepad)
{	
	if(gamepad !== undefined && gamepad !== null)
	{
		//Store gamepad and its index
		this.index = gamepad.index;
		this.gamepad = gamepad;

		//Create and initialize buttons
		this.buttons = [];
		for(var i = 0; i < gamepad.buttons.length; i++)
		{
			this.buttons.push(new Key());
		}

		//Try to get the device vendor and product id
		this.setProductVendor(gamepad);
		this.connected = true;
	}
	else
	{
		console.warn("nunuStudio: No gamepad found");
		this.disconnect();
	}
};

/**
 * Disconnect this gamepad object.
 * 
 * @method disconnect
 */
Gamepad.prototype.disconnect = function()
{
	this.vendor = -1;
	this.product = -1;
	this.connected = false;

	this.gamepad = null;
	this.buttons = [];
};

/**
 * Get vendor id and product id for the connected gamepad.
 *
 * @method setProductVendor
 * @param {Object} gamepad Gamepad object.
 */
Gamepad.prototype.setProductVendor = function(gamepad)
{
	//Chrome
	try
	{
		var temp = gamepad.id.split(":");

		this.vendor = temp[1].split(" ")[1];
		this.product = temp[2].replace(" ", "").replace(")", "");

		return;
	}
	catch(e){}

	//Firefox
	try
	{
		var temp = gamepad.id.split("-");

		this.vendor = temp[0];
		this.product = temp[1];

		return;
	}
	catch(e){}
};

/**
 * Update the gamepad state.
 *
 * Should be called every frame before checking the buttons values.
 * 
 * @method update
 */
Gamepad.prototype.update = function()
{
	this.gamepad = navigator.getGamepads()[this.index];

	if(this.gamepad !== undefined)
	{
		for(var i = 0; i < this.buttons.length; i++)
		{
			this.buttons[i].update(this.gamepad.buttons[i].pressed ? Key.DOWN : Key.UP);
		}
	}
};

/**
 * Get analog button value between 0 and 1.
 *
 * If the button is not analog enabled it will return 0 if button is not pressed or 1 if the button is pressed.
 *
 * @method getAnalogueButton
 * @param {Number} button Button to get analogue value from.
 * @return {Number} Value between 0 and 1 depending how hard the button is pressed.
 */
Gamepad.prototype.getAnalogueButton = function(button)
{
	return (button > this.buttons.length || button < 0) ? 0 : this.gamepad.buttons[button].value;
};

/**
 * Get axis value between -1 and 1 depending on the direction.
 *
 * @method getAxis
 * @param {Number} Axis to get value from.
 * @return {Number} Value between -1 and 1 depending on the axis direction
 */
Gamepad.prototype.getAxis = function(axis)
{
	return (axis > this.gamepad.axes.length || axis < 0) ? 0 : this.gamepad.axes[axis];
};

/**
 * Check if a button exists in the connected Gamepad.
 * 
 * @method buttonExists
 * @param {Number} button Button to check status of
 * @return {boolean} True if button exists in the connected gamepad.
 */
Gamepad.prototype.buttonExists = function(button)
{
	return button >= 0 && button < this.buttons.length;
};

/**
 * Check if gamepad button is currently pressed.
 * 
 * @method buttonPressed
 * @param {Number} button Button to check status of
 * @return {boolean} True if button is currently pressed
 */
Gamepad.prototype.buttonPressed = function(button)
{
	return this.buttons[button] ? this.buttons[button].pressed : false;
};

/**
 * Check if a gamepad button was just pressed.
 * 
 * @method buttonJustPressed
 * @param {Number} button Button to check status of
 * @return {boolean} True if button was just pressed
 */
Gamepad.prototype.buttonJustPressed = function(button)
{
	return this.buttons[button] ? this.buttons[button].justPressed : false;
};

/**
 * Check if a gamepad button was just released.
 * 
 * @method buttonJustReleased
 * @param {Number} button Button to check status of
 * @return {boolean} True if button was just released
 */
Gamepad.prototype.buttonJustReleased = function(button)
{
	return this.buttons[button] ? this.buttons[button].justReleased : false;
};

/**
 * Gamepad LEFT button.
 * @type {Number}
 * @attribute LEFT
 */
Gamepad.LEFT = 14;

/**
 * Gamepad RIGHT button.
 * @type {Number}
 * @attribute RIGHT
 */
Gamepad.RIGHT = 15;

/**
 * Gamepad DOWN button.
 * @type {Number}
 * @attribute DOWN
 */
Gamepad.DOWN = 13;

/**
 * Gamepad UP button.
 * @type {Number}
 * @attribute UP
 */
Gamepad.UP = 12;

/**
 * Gamepad SELECT button.
 * @type {Number}
 * @attribute SELECT
 */
Gamepad.SELECT = 8;

/**
 * Gamepad START button.
 * @type {Number}
 * @attribute START
 */
Gamepad.START = 9;

/**
 * Gamepad HOME button.
 * @type {Number}
 * @attribute HOME
 */
Gamepad.HOME = 16;

/**
 * Gamepad LEFT_TRIGGER_A button.
 * @type {Number}
 * @attribute LEFT_TRIGGER_A
 */
Gamepad.LEFT_TRIGGER_A = 4;

/**
 * Gamepad LEFT_TRIGGER_B button.
 * @type {Number}
 * @attribute LEFT_TRIGGER_B
 */
Gamepad.LEFT_TRIGGER_B = 6;

/**
 * Gamepad RIGHT_TRIGGER_A button.
 * @type {Number}
 * @attribute RIGHT_TRIGGER_A
 */
Gamepad.RIGHT_TRIGGER_A = 5;

/**
 * Gamepad RIGHT_TRIGGER_B button.
 * @type {Number}
 * @attribute RIGHT_TRIGGER_B
 */
Gamepad.RIGHT_TRIGGER_B = 7;

/**
 * Gamepad L1 button.
 * @type {Number}
 * @attribute L1
 */
Gamepad.L1 = 4;

/**
 * Gamepad L2 button.
 * @type {Number}
 * @attribute L2
 */
Gamepad.L2 = 6;

/**
 * Gamepad L3 button.
 * @type {Number}
 * @attribute L3
 */
Gamepad.L3 = 6;

/**
 * Gamepad R1 button.
 * @type {Number}
 * @attribute R1
 */
Gamepad.R1 = 5;

/**
 * Gamepad R2 button.
 * @type {Number}
 * @attribute R2
 */
Gamepad.R2 = 7;

/**
 * Gamepad R3 button.
 * @type {Number}
 * @attribute R3
 */
Gamepad.R3 = 11;

/**
 * Gamepad A button.
 * @type {Number}
 * @attribute A
 */
Gamepad.A = 0;

/**
 * Gamepad B button.
 * @type {Number}
 * @attribute B
 */
Gamepad.B = 1;

/**
 * Gamepad C button.
 * @type {Number}
 * @attribute C
 */
Gamepad.C = 2;

/**
 * Gamepad D button.
 * @type {Number}
 * @attribute D
 */
Gamepad.D = 3;

/**
 * Gamepad X button.
 * @type {Number}
 * @attribute X
 */
Gamepad.X = 2;

/**
 * Gamepad Y button.
 * @type {Number}
 * @attribute Y
 */
Gamepad.Y = 3;

/**
 * Gamepad LEFT_ANALOGUE_BUT axis.
 * @type {Number}
 * @attribute LEFT_ANALOGUE_BUT
 */
Gamepad.LEFT_ANALOGUE_BUT = 10;

/**
 * Gamepad LEFT_ANALOGUE_HOR axis.
 * @type {Number}
 * @attribute LEFT_ANALOGUE_HOR
 */
Gamepad.LEFT_ANALOGUE_HOR = 0;

/**
 * Gamepad LEFT_ANALOGUE_VERT axis.
 * @type {Number}
 * @attribute LEFT_ANALOGUE_VERT
 */
Gamepad.LEFT_ANALOGUE_VERT = 1;

/**
 * Gamepad RIGHT_ANALOGUE_BUT axis.
 * @type {Number}
 * @attribute RIGHT_ANALOGUE_BUT
 */
Gamepad.RIGHT_ANALOGUE_BUT = 11;

/**
 * Gamepad RIGHT_ANALOGUE_HOR axis.
 * @type {Number}
 * @attribute RIGHT_ANALOGUE_HOR
 */
Gamepad.RIGHT_ANALOGUE_HOR = 2;

/**
 * Gamepad RIGHT_ANALOGUE_VERT axis.
 * @type {Number}
 * @attribute RIGHT_ANALOGUE_VERT
 */
Gamepad.RIGHT_ANALOGUE_VERT = 3;
