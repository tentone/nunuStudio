import {EventManager} from "../utils/EventManager.js";
import {Key} from "./Key.js";

/**
 * Keyboard instance for input in sync with the running application, internally stores the key transitions provided by the browser.
 * 
 * Allow to detect every key press, release event in sync with the app frame update.
 *
 * The keyboard object provided by scripts is automatically updated by the runtime handler.
 * 
 * @class Keyboard
 * @module Input
 * @param {boolean} dontInitialize If true the mouse events are not created.
 */
function Keyboard(dontInitialize)
{
	/**
	 * Array with keyboard keys status.
	 *
	 * @property keys
	 * @type {Array}
	 */
	this.keys = [];

	/**
	 * The actions array serves as a buffer for the key input actions.
	 *
	 * Until the update method is called it stores all the key stroke actions.
	 *
	 * On update the key strokes are updated and the keys array stores the correct values.
	 *
	 * @property actions
	 * @type {Array}
	 */
	this.actions = [];

	var self = this;
	var actions = this.actions;

	/**
	 * Event manager used to handle the keyup, keydown and focus events.
	 *
	 * On each event actions are added to the actions array.
	 *
	 * @property events
	 * @type {EventManager}
	 */
	this.events = new EventManager();
	this.events.add(window, "keydown", function(event)
	{
		actions.push(event.keyCode);
		actions.push(Key.DOWN);
	});
	this.events.add(window, "keyup", function(event)
	{
		actions.push(event.keyCode);
		actions.push(Key.UP);
	});
	this.events.add(window, "focus", function(event)
	{
		self.reset();
	});

	if(dontInitialize !== true)
	{
		this.create();
	}
}

Keyboard.prototype = Keyboard;
Keyboard.prototype.constructor = Keyboard;

/**
 * Update key flags synchronously.
 * 
 * @method update
 */
Keyboard.update = function()
{
	var end = 0;

	while(this.actions.length > end)
	{
		var key = this.actions.shift();
		var action = this.actions.shift();

		if(this.keys[key] === undefined)
		{
			this.keys[key] = new Key();
		}

		this.keys[key].update(action);

		if(this.keys[key].justReleased || this.keys[key].justPressed)
		{
			this.actions.push(key);
			this.actions.push(Key.RESET);
			end += 2;
		}
	}
};

/**
 * Reset keyboard status to default.
 *
 * Does not clean the action list.
 * 
 * @method reset
 */
Keyboard.reset = function()
{
	// Reset all keys
	for(var i = 0; i < this.keys.length; i++)
	{
		if(this.keys[i] !== undefined)
		{
			this.keys[i].reset();
		}
	}
};

/**
 * Check if a key is pressed.
 * 
 * @method keyPressed
 * @return {boolean} True is the key is currently pressed
 */
Keyboard.keyPressed = function(key)
{
	return this.keys[key] !== undefined && this.keys[key].pressed;
};

/**
 * Check is a key as just pressed.
 * 
 * @method keyJustPressed
 * @return {boolean} True is the key was just pressed
 */
Keyboard.keyJustPressed = function(key)
{
	return this.keys[key] !== undefined && this.keys[key].justPressed;
};

/**
 * Check if a key was just released.
 * 
 * @method keyJustReleased
 * @return {boolean} True is the key was just pressed
 */
Keyboard.keyJustReleased = function(key)
{
	return this.keys[key] !== undefined && this.keys[key].justReleased;
};

/**
 * Create keyboard events.
 * 
 * @method dispose
 */
Keyboard.create = function()
{
	this.events.create();
};

/**
 * Dispose keyboard events.
 * 
 * @method dispose
 */
Keyboard.dispose = function()
{
	this.events.destroy();
};

/**
 * TAB key
 * @attribute TAB
 * @type {number}
 */
Keyboard.TAB = 9;

/**
 * ENTER key
 * @attribute ENTER
 * @type {number}
 */
Keyboard.ENTER = 13;

/**
 * SHIFT key
 * @attribute SHIFT
 * @type {number}
 */
Keyboard.SHIFT = 16;

/**
 * CTRL key
 * @attribute CTRL
 * @type {number}
 */
Keyboard.CTRL = 17;

/**
 * ALT key
 * @attribute ALT
 * @type {number}
 */
Keyboard.ALT = 18;

/**
 * CAPS_LOCK key
 * @attribute CAPS_LOCK
 * @type {number}
 */
Keyboard.CAPS_LOCK = 20;

/**
 * ESC key
 * @attribute ESC
 * @type {number}
 */
Keyboard.ESC = 27;

/**
 * SPACEBAR key
 * @attribute SPACEBAR
 * @type {number}
 */
Keyboard.SPACEBAR = 32;

/**
 * PAGE_UP key
 * @attribute PAGE_UP
 * @type {number}
 */
Keyboard.PAGE_UP = 33;

/**
 * PAGE_DOWN key
 * @attribute PAGE_DOWN
 * @type {number}
 */
Keyboard.PAGE_DOWN = 34;

/**
 * END key
 * @attribute END
 * @type {number}
 */
Keyboard.END = 35;

/**
 * HOME key
 * @attribute HOME
 * @type {number}
 */
Keyboard.HOME = 36;

/**
 * INSERT key
 * @attribute INSERT
 * @type {number}
 */
Keyboard.INSERT = 45;

/**
 * DEL key
 * @attribute DEL
 * @type {number}
 */
Keyboard.DEL = 46;

/**
 * LEFT key
 * @attribute LEFT
 * @type {number}
 */
Keyboard.LEFT = 37;

/**
 * RIGHT key
 * @attribute RIGHT
 * @type {number}
 */
Keyboard.RIGHT = 39;

/**
 * UP key
 * @attribute UP
 * @type {number}
 */
Keyboard.UP = 38;

/**
 * DOWN key
 * @attribute DOWN
 * @type {number}
 */
Keyboard.DOWN = 40;

/**
 * NUM0 key
 * @attribute NUM0
 * @type {number}
 */
Keyboard.NUM0 = 48;

/**
 * NUM1 key
 * @attribute NUM1
 * @type {number}
 */
Keyboard.NUM1 = 49;

/**
 * NUM2 key
 * @attribute NUM2
 * @type {number}
 */
Keyboard.NUM2 = 50;

/**
 * NUM3 key
 * @attribute NUM3
 * @type {number}
 */
Keyboard.NUM3 = 51;

/**
 * NUM4 key
 * @attribute NUM4
 * @type {number}
 */
Keyboard.NUM4 = 52;

/**
 * NUM5 key
 * @attribute NUM5
 * @type {number}
 */
Keyboard.NUM5 = 53;

/**
 * NUM6 key
 * @attribute NUM6
 * @type {number}
 */
Keyboard.NUM6 = 54;

/**
 * NUM7 key
 * @attribute NUM7
 * @type {number}
 */
Keyboard.NUM7 = 55;

/**
 * NUM8 key
 * @attribute NUM8
 * @type {number}
 */
Keyboard.NUM8 = 56;

/**
 * NUM9 key
 * @attribute NUM9
 * @type {number}
 */
Keyboard.NUM9 = 57;

/**
 * A key
 * @attribute A
 * @type {number}
 */
Keyboard.A = 65;

/**
 * B key
 * @attribute B
 * @type {number}
 */
Keyboard.B = 66;

/**
 * C key
 * @attribute C
 * @type {number}
 */
Keyboard.C = 67;

/**
 * D key
 * @attribute D
 * @type {number}
 */
Keyboard.D = 68;

/**
 * E key
 * @attribute E
 * @type {number}
 */
Keyboard.E = 69;

/**
 * F key
 * @attribute F
 * @type {number}
 */
Keyboard.F = 70;

/**
 * G key
 * @attribute G
 * @type {number}
 */
Keyboard.G = 71;

/**
 * H key
 * @attribute H
 * @type {number}
 */
Keyboard.H = 72;

/**
 * I key
 * @attribute I
 * @type {number}
 */
Keyboard.I = 73;

/**
 * J key
 * @attribute J
 * @type {number}
 */
Keyboard.J = 74;

/**
 * K key
 * @attribute K
 * @type {number}
 */
Keyboard.K = 75;

/**
 * L key
 * @attribute L
 * @type {number}
 */
Keyboard.L = 76;

/**
 * M key
 * @attribute M
 * @type {number}
 */
Keyboard.M = 77;

/**
 * N key
 * @attribute N
 * @type {number}
 */
Keyboard.N = 78;

/**
 * O key
 * @attribute O
 * @type {number}
 */
Keyboard.O = 79;

/**
 * P key
 * @attribute P
 * @type {number}
 */
Keyboard.P = 80;

/**
 * Q key
 * @attribute Q
 * @type {number}
 */
Keyboard.Q = 81;

/**
 * R key
 * @attribute R
 * @type {number}
 */
Keyboard.R = 82;

/**
 * S key
 * @attribute S
 * @type {number}
 */
Keyboard.S = 83;

/**
 * T key
 * @attribute T
 * @type {number}
 */
Keyboard.T = 84;

/**
 * U key
 * @attribute U
 * @type {number}
 */
Keyboard.U = 85;

/**
 * V key
 * @attribute V
 * @type {number}
 */
Keyboard.V = 86;

/**
 * W key
 * @attribute W
 * @type {number}
 */
Keyboard.W = 87;

/**
 * X key
 * @attribute X
 * @type {number}
 */
Keyboard.X = 88;

/**
 * Y key
 * @attribute Y
 * @type {number}
 */
Keyboard.Y = 89;

/**
 * Z key
 * @attribute Z
 * @type {number}
 */
Keyboard.Z = 90;

/**
 * F1 key
 * @attribute F1
 * @type {number}
 */
Keyboard.F1 = 112;

/**
 * F2 key
 * @attribute F2
 * @type {number}
 */
Keyboard.F2 = 113;

/**
 * F3 key
 * @attribute F3
 * @type {number}
 */
Keyboard.F3 = 114;

/**
 * F4 key
 * @attribute F4
 * @type {number}
 */
Keyboard.F4 = 115;

/**
 * F5 key
 * @attribute F5
 * @type {number}
 */
Keyboard.F5 = 116;

/**
 * F6 key
 * @attribute F6
 * @type {number}
 */
Keyboard.F6 = 117;

/**
 * F7 key
 * @attribute F7
 * @type {number}
 */
Keyboard.F7 = 118;

/**
 * F8 key
 * @attribute F8
 * @type {number}
 */
Keyboard.F8 = 119;

/**
 * F9 key
 * @attribute F9
 * @type {number}
 */
Keyboard.F9 = 120;

/**
 * F10 key
 * @attribute F10
 * @type {number}
 */
Keyboard.F10 = 121;

/**
 * F11 key
 * @attribute F11
 * @type {number}
 */
Keyboard.F11 = 122;

/**
 * F12 key
 * @attribute F12
 * @type {number}
 */
Keyboard.F12 = 123;
export {Keyboard};