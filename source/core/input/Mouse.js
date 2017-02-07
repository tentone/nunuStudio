"use strict";

function Mouse()
{
	//Raw data
	this._keys = [];
	this._position = new Vector2(0, 0);
	this._positionUpdated = false;
	this._delta = new Vector2(0, 0);
	this._wheel = 0;
	this._wheelUpdated = false;
	this._doubleClicked = false;

	//Position, delta, and scroll speed
	this.keys = [];
	this.position = new Vector2(0,0);
	this.delta = new Vector2(0,0);
	this.wheel = 0;
	this.doubleClicked = false;

	//Canvas (use to calculate coordinates relative to it)
	this.canvas = null;
	
	//Events
	this.events = [];

	//Initialize key instances
	for(var i = 0; i < 3; i++)
	{
		this._keys.push(new Key());
		this.keys.push(new Key());
	}

	//Self pointer
	var self = this;

	//Scroll wheel
	if(window.onmousewheel !== undefined)
	{
		//Chrome, edge
		this.events.push([window, "mousewheel", function(event)
		{
			self._wheel = event.deltaY;
			self._wheelUpdated = true;
		}]);
	}
	else if(window.addEventListener !== undefined)
	{
		//Firefox
		this.events.push([window, "DOMMouseScroll", function(event)
		{
			self._wheel = event.detail * 30;
			self._wheelUpdated = true;
		}]);
	}
	else
	{
		this.events.push([window, "wheel", function(event)
		{
			self._wheel = event.deltaY;
			self._wheelUpdated = true;
		}]);
	}

	//Touchscreen input
	if("ontouchstart" in window || navigator.msMaxTouchPoints > 0)
	{
		//Auxiliar variables to calculate touch delta
		var lastTouch = new Vector2(0, 0);

		//Touch screen pressed event
		this.events.push([window, "touchstart", function(event)
		{
			var touch = event.touches[0];
			lastTouch.set(touch.clientX, touch.clientY);
			self.updateKey(Mouse.LEFT, Key.DOWN);
		}]);

		//Touch screen released event
		this.events.push([window, "touchend", function(event)
		{
			self.updateKey(Mouse.LEFT, Key.UP);
		}]);

		//Touch screen move event
		this.events.push([window, "touchmove", function(event)
		{
			var touch = event.touches[0];

			if(self.canvas !== null)
			{
				var rect = self.canvas.getBoundingClientRect();
				self.updatePosition(touch.clientX - rect.left, touch.clientY - rect.top, touch.clientX - lastTouch.x, touch.clientY - lastTouch.y);
			}
			else
			{
				self.updatePosition(touch.clientX, touch.clientY, touch.clientX - lastTouch.x, touch.clientY - lastTouch.y);
			}

			lastTouch.set(touch.clientX, touch.clientY);
		}]);
	}
	//Input
	else
	{
		//Move event
		this.events.push([window, "mousemove", function(event)
		{
			if(self.canvas !== null)
			{
				var rect = self.canvas.getBoundingClientRect();
				self.updatePosition(event.clientX - rect.left, event.clientY - rect.top, event.movementX, event.movementY);
			}
			else
			{
				self.updatePosition(event.clientX, event.clientY, event.movementX, event.movementY);
			}
		}]);

		//Button pressed event
		this.events.push([window, "mousedown", function(event)
		{
			self.updateKey(event.which - 1, Key.DOWN);
		}]);

		//Button released event
		this.events.push([window, "mouseup", function(event)
		{
			self.updateKey(event.which - 1, Key.UP);
		}]);
	}

	//Mouse double click
	this.events.push([window, "dblclick", function(event)
	{
		self._doubleClicked = true;
	}]);

	//Initialize events
	for(var i = 0; i < this.events.length; i++)
	{
		var event = this.events[i];
		event[0].addEventListener(event[1], event[2]);
	}
}

//Prototype
Mouse.prototype = Mouse;

//Mouse Buttons
Mouse.LEFT = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;

//Canvas to be used for relative coordinates calculation
Mouse.setCanvas = function(canvas)
{
	this.canvas = canvas;

	canvas.mouseInside = false;

	canvas.addEventListener("mouseenter", function()
	{
		this.mouseInside = true;
	});

	canvas.addEventListener("mouseleave", function()
	{
		this.mouseInside = false;
	});
}

//Check if mouse is inside attached canvas
Mouse.insideCanvas = function()
{
	if(this.canvas === null)
	{
		return false;
	}
	
	return this.canvas.mouseInside;
}

//Set if mouse locked
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
}

//Check if mouse button is pressed
Mouse.buttonPressed = function(button)
{
	return this.keys[button].pressed;
}

//Check if Mouse button was double clicked
Mouse.buttonDoubleClicked = function()
{
	return this.doubleClicked;
}

//Check if a mouse button was just pressed
Mouse.buttonJustPressed = function(button)
{
	return this.keys[button].justPressed;
}

//Check if a mouse button was just released
Mouse.buttonJustReleased = function(button)
{
	return this.keys[button].justReleased;
}

//Update mouse Position
Mouse.updatePosition = function(x, y, xDiff, yDiff)
{
	this._position.set(x, y);
	this._delta.x += xDiff;
	this._delta.y += yDiff;
	this._positionUpdated = true;
}

//Update mouse Key
Mouse.updateKey = function(button, action)
{
	if(button > -1)
	{
		this._keys[button].update(action);
	}
}

//Update mouse State (Calculate position diff)
Mouse.update = function()
{
	//Update mouse keys state
	for(var i = 0; i < this._keys.length; i++)
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

	//Update mouse double click
	if(this._doubleClicked)
	{
		this.doubleClicked = true;
		this._doubleClicked = false;
	}
	else
	{
		this.doubleClicked = false;
	}

	//Update mouse Position if needed
	if(this._positionUpdated)
	{
		this.delta.x = this._delta.x;
		this.delta.y = this._delta.y;
		this._delta.set(0,0);

		this.position.x = this._position.x;
		this.position.y = this._position.y;

		this._positionUpdated = false;
	}
	else
	{
		this.delta.x = 0;
		this.delta.y = 0;
	}
}

//Dispose mouse object
Mouse.dispose = function()
{
	for(var i = 0; i < this.events.length; i++)
	{
		var event = this.events[i];
		event[0].removeEventListener(event[1], event[2]);
	}
}
