"use strict";

/**
 * Mouse instance for input in sync with the running 3D application.
 *
 * The mouse object provided by scripts is automatically updated by the runtime handler.
 * 
 * @class Mouse
 * @module Input
 * @param {DOM} domElement DOM element to craete the mouse events.
 * @param {Boolean} dontInitialize If true the mouse events are not created.
 */
function Mouse(domElement, dontInitialize)
{
	//Raw data
	this._keys = new Array(5);
	this._position = new THREE.Vector2(0, 0);
	this._positionUpdated = false;
	this._delta = new THREE.Vector2(0, 0);
	this._wheel = 0;
	this._wheelUpdated = false;
	this._doubleClicked = new Array(5);

	/**
	 * Array with mouse buttons status.
	 *
	 * @type {array}
	 * @property keys
	 */
	this.keys = new Array(5);

	/**
	 * Mouse position inside of the window (coordinates in window space).
	 *
	 * @type {Vector2}
	 * @property position
	 */
	this.position = new THREE.Vector2(0, 0);

	/**
	 * Mouse movement (coordinates in window space).
	 *
	 * @type {Vector2}
	 * @property delta
	 */
	this.delta = new THREE.Vector2(0, 0);

	/**
	 * Mouse scroll wheel movement.
	 *
	 * @type {Number}
	 * @property wheel
	 */
	this.wheel = 0;
	
	/**
	 * Indicates a button of the mouse was double clicked.
	 *
	 * @type {Array}
	 * @property doubleClicked
	 */
	this.doubleClicked = new Array(5);

	/**
	 * DOM element where to attach the mouse events.
	 *
	 * @property domElement
	 * @type {DOM}
	 */
	this.domElement = (domElement !== undefined) ? domElement : window;

	/**
	 * Canvas attached to this mouse instance used to calculate position and delta in element space coordinates.
	 *
	 * @type {DOM}
	 * @property canvas
	 */
	this.canvas = null;
	
	//Events
	this.events = new EventManager();

	//Initialize key instances
	for(var i = 0; i < 5; i++)
	{
		this._doubleClicked[i] = false;
		this.doubleClicked[i] = false;
		this._keys[i] = new Key();
		this.keys[i] = new Key();
	}

	//Self pointer
	var self = this;

	//Scroll wheel
	if(window.onmousewheel !== undefined)
	{
		//Chrome, edge
		this.events.add(this.domElement, "mousewheel", function(event)
		{
			self._wheel = event.deltaY;
			self._wheelUpdated = true;
			//event.preventDefault();
		});
	}
	else if(window.addEventListener !== undefined)
	{
		//Firefox
		this.events.add(this.domElement, "DOMMouseScroll", function(event)
		{
			self._wheel = event.detail * 30;
			self._wheelUpdated = true;
			//event.preventDefault();
		});
	}
	else
	{
		this.events.add(this.domElement, "wheel", function(event)
		{
			self._wheel = event.deltaY;
			self._wheelUpdated = true;
			//event.preventDefault();
		});
	}

	//Touchscreen input events
	if(window.ontouchstart !== undefined || navigator.msMaxTouchPoints > 0)
	{
		//Auxiliar variables to calculate touch delta
		var lastTouch = new Vector2(0, 0);

		//Touch start event
		this.events.add(this.domElement, "touchstart", function(event)
		{
			var touch = event.touches[0];

			self.updatePosition(touch.clientX, touch.clientY, 0, 0);
			self.updateKey(Mouse.LEFT, Key.DOWN);

			lastTouch.set(touch.clientX, touch.clientY);
		});

		//Touch end event
		this.events.add(this.domElement, "touchend", function(event)
		{
			self.updateKey(Mouse.LEFT, Key.UP);
		});

		//Touch cancel event
		this.events.add(this.domElement, "touchcancel", function(event)
		{
			self.updateKey(Mouse.LEFT, Key.UP);
		});

		//Touch move event
		this.events.add(document.body, "touchmove", function(event)
		{
			var touch = event.touches[0];
			self.updatePosition(touch.clientX, touch.clientY, touch.clientX - lastTouch.x, touch.clientY - lastTouch.y);
			lastTouch.set(touch.clientX, touch.clientY);
		});
	}

	//Move
	this.events.add(this.domElement, "mousemove", function(event)
	{
		self.updatePosition(event.clientX, event.clientY, event.movementX, event.movementY);
	});

	//Button pressed
	this.events.add(this.domElement, "mousedown", function(event)
	{
		self.updateKey(event.which - 1, Key.DOWN);
	});

	//Button released
	this.events.add(this.domElement, "mouseup", function(event)
	{
		self.updateKey(event.which - 1, Key.UP);
	});

	//Drag start
	this.events.add(this.domElement, "dragstart", function(event)
	{
		self.updateKey(event.which - 1, Key.UP);
	});

	//Mouse double click
	this.events.add(this.domElement, "dblclick", function(event)
	{	
		self._doubleClicked[event.which - 1] = true;
	});

	if(dontInitialize !== true)
	{
		this.create();
	}
}

Mouse.prototype = Mouse;
Mouse.prototype.constructor = Mouse;

/**
 * Left mouse button.
 *
 * @attribute LEFT
 * @type {Number}
 */
Mouse.LEFT = 0;

/**
 * Middle mouse button.
 *
 * @attribute MIDDLE
 * @type {Number}
 */
Mouse.MIDDLE = 1;

/**
 * Right mouse button.
 *
 * @attribute RIGHT
 * @type {Number}
 */
Mouse.RIGHT = 2;

/**
 * Back mouse navigation button.
 *
 * @attribute BACK
 * @type {Number}
 */
Mouse.BACK = 3;

/**
 * Forward mouse navigation button.
 *
 * @attribute FORWARD
 * @type {Number}
 */
Mouse.FORWARD = 4;

/**
 * Element to be used for coordinates calculation relative to that canvas.
 * 
 * @method setCanvas
 * @param {DOM} canvas Canvas to be attached to the Mouse instance
 */
Mouse.setCanvas = function(element)
{
	this.canvas = element;

	element.mouseInside = false;

	element.addEventListener("mouseenter", function()
	{
		this.mouseInside = true;
	});

	element.addEventListener("mouseleave", function()
	{
		this.mouseInside = false;
	});
};

/**
 * Check if mouse is inside attached canvas (updated async).
 * 
 * @method insideCanvas
 * @return {boolean} True if mouse is currently inside the canvas
 */
Mouse.insideCanvas = function()
{
	return this.canvas !== null && this.canvas.mouseInside;
};

/**
 * Set mouse lock state.
 * 
 * @method setLock
 * @param {boolean} value If true pointer lock will be requested for the canvas attached to the Mouse instance
 */
Mouse.setLock = function(value)
{
	if(this.canvas !== null)
	{
		if(value)
		{
			if(this.canvas.requestPointerLock)
			{
				this.canvas.requestPointerLock();
			}
			else if(this.canvas.mozRequestPointerLock)
			{
				this.canvas.mozRequestPointerLock();
			}
			else if(this.canvas.webkitRequestPointerLock)
			{
				this.canvas.webkitRequestPointerLock();
			}
		}
		else
		{
			if(document.exitPointerLock)
			{
				document.exitPointerLock();
			}
			else if(document.mozExitPointerLock)
			{
				document.mozExitPointerLock();
			}
			else if(document.webkitExitPointerLock)
			{
				document.webkitExitPointerLock();
			}
		}
	}
};

/**
 * Check if mouse button is currently pressed.
 * 
 * @method buttonPressed
 * @param {Number} button Button to check status of
 * @return {boolean} True if button is currently pressed
 */
Mouse.buttonPressed = function(button)
{
	return this.keys[button].pressed;
};

/**
 * Check if Mouse button was double clicked.
 * 
 * @method buttonDoubleClicked
 * @param {Number} button Button to check status of
 * @return {boolean} True if some mouse button was just double clicked
 */
Mouse.buttonDoubleClicked = function(button)
{
	return this.doubleClicked[button];
};

/**
 * Check if a mouse button was just pressed.
 * 
 * @method buttonJustPressed
 * @param {Number} button Button to check status of
 * @return {boolean} True if button was just pressed
 */
Mouse.buttonJustPressed = function(button)
{
	return this.keys[button].justPressed;
};

/**
 * Check if a mouse button was just released.
 * 
 * @method buttonJustReleased
 * @param {Number} button Button to check status of
 * @return {boolean} True if button was just released
 */
Mouse.buttonJustReleased = function(button)
{
	return this.keys[button].justReleased;
};

/**
 * Update mouse position.
 *
 * Automatically called by the runtime.
 * 
 * @method updatePosition
 * @param {Number} x
 * @param {Number} y
 * @param {Number} xDiff
 * @param {Number} yDiff
 */
Mouse.updatePosition = function(x, y, xDiff, yDiff)
{
	if(this.canvas !== null)
	{
		var rect = this.canvas.getBoundingClientRect();
		x -= rect.left;
		y -= rect.top;
	}

	this._position.set(x, y);
	this._delta.x += xDiff;
	this._delta.y += yDiff;
	this._positionUpdated = true;
};

/**
 * Update a mouse button.
 * 
 * Automatically called by the runtime.
 *
 * @method updateKey
 * @param {Number} button
 * @param {Number} action
 */
Mouse.updateKey = function(button, action)
{
	if(button > -1)
	{
		this._keys[button].update(action);
	}
};

/**
 * Update mouse buttons state, position, wheel and delta synchronously.
 * 
 * @method update
 */
Mouse.update = function()
{
	//Update mouse keys state
	for(var i = 0; i < 5; i++)
	{
		if(this._keys[i].justPressed && this.keys[i].justPressed)
		{
			this._keys[i].justPressed = false;
		}
		if(this._keys[i].justReleased && this.keys[i].justReleased)
		{
			this._keys[i].justReleased = false;
		}

		this.keys[i].set(this._keys[i].justPressed, this._keys[i].pressed, this._keys[i].justReleased);

		//Update mouse double click
		if(this._doubleClicked[i] === true)
		{
			this.doubleClicked[i] = true;
			this._doubleClicked[i] = false;
		}
		else
		{
			this.doubleClicked[i] = false;
		}
	}

	//Update mouse wheel
	if(this._wheelUpdated)
	{
		this.wheel = this._wheel;
		this._wheelUpdated = false;
	}
	else
	{
		this.wheel = 0;
	}

	//Update mouse Position if needed
	if(this._positionUpdated)
	{
		this.delta.copy(this._delta);
		this.position.copy(this._position);

		this._delta.set(0,0);
		this._positionUpdated = false;
	}
	else
	{
		this.delta.x = 0;
		this.delta.y = 0;
	}
};

/**
 * Create mouse events.
 * 
 * @method create
 */
Mouse.create = function()
{
	this.events.create();
};

/**
 * Dispose mouse events.
 * 
 * @method dispose
 */
Mouse.dispose = function()
{
	this.events.destroy();
};
