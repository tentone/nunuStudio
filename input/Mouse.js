"use strict";

function Mouse(){}

//Mouse Atached to camera
Mouse.initialize = function()
{
	//Mouse raw data
	Mouse._keys = [];
	Mouse._position = new THREE.Vector2(0,0);
	Mouse._position_updated = false;
	Mouse._delta = new THREE.Vector2(0,0);
	Mouse._wheel = 0;
	Mouse._wheel_updated = false;

	//Mouse position, delta, and scroll speed
	Mouse.keys = [];
	Mouse.position = new THREE.Vector2(0,0);
	Mouse.delta = new THREE.Vector2(0,0);
	Mouse.wheel = 0;

	//Calculate coordinates relative to canvas
	Mouse.canvas = null;

	//Initialize key instances
	for(var i = 0; i < 3; i++)
	{
		Mouse._keys.push(new Key());
		Mouse.keys.push(new Key());
	}

	//Scroll wheel
	if(document.onmousewheel !== undefined)
	{
		//Chrome, edge
		document.addEventListener("mousewheel", function(event)
		{
			Mouse._wheel = event.deltaY;
			Mouse._wheel_updated = true;
		}, false);
	}
	else if(document.addEventListener !== undefined)
	{
		//Firefox
		document.addEventListener("DOMMouseScroll", function(event)
		{
			Mouse._wheel = event.detail * 30;
			Mouse._wheel_updated = true;
		}, false);
	}
	else
	{
		document.onwheel = function(event)
		{
			Mouse._wheel = event.deltaY;
			Mouse._wheel_updated = true;
		};
	}

	//Touchscreen input
	if("ontouchstart" in window || navigator.msMaxTouchPoints > 0)
	{
		//Auxiliar variables to calculate touch delta
		var last_touch = new THREE.Vector2(0, 0);

		//Touch screen pressed event
		document.addEventListener("touchstart", function(event)
		{
			var touch = event.touches[0];
			last_touch.set(touch.clientX, touch.clientY);
			Mouse.updateKey(Mouse.LEFT, Key.KEY_DOWN);
		}, false);

		//Touch screen released event
		document.addEventListener("touchend", function(event)
		{
			Mouse.updateKey(Mouse.LEFT, Key.KEY_UP);
		}, false);

		//Touch screen move event
		document.addEventListener("touchmove", function(event)
		{
			var touch = event.touches[0];

			if(Mouse.canvas !== null)
			{
				var rect = Mouse.canvas.getBoundingClientRect();
				Mouse.updatePosition(touch.clientX - rect.left, touch.clientY - rect.top, touch.clientX - last_touch.x, touch.clientY - last_touch.y);
			}
			else
			{
				Mouse.updatePosition(touch.clientX, touch.clientY, touch.clientX - last_touch.x, touch.clientY - last_touch.y);
			}

			last_touch.set(touch.clientX, touch.clientY);
		}, false);
	}
	//Mouse input
	else
	{
		//Mouse move event
		document.addEventListener("mousemove", function(event)
		{
			if(Mouse.canvas !== null)
			{
				var rect = Mouse.canvas.getBoundingClientRect();
				Mouse.updatePosition(event.clientX - rect.left, event.clientY - rect.top, event.movementX, event.movementY);
			}
			else
			{
				Mouse.updatePosition(event.clientX, event.clientY, event.movementX, event.movementY);
			}
		}, false);

		//Mouse button pressed event
		document.addEventListener("mousedown", function(event)
		{
			Mouse.updateKey(event.which - 1, Key.KEY_DOWN);
		}, false);

		//Mouse button released event
		document.addEventListener("mouseup", function(event)
		{
			Mouse.updateKey(event.which - 1, Key.KEY_UP);
		}, false);
	}
}

//Mouse Buttons
Mouse.LEFT = 0;
Mouse.MIDDLE = 1;
Mouse.RIGHT = 2;

//Canvas to be used for relative coordinates calculation
Mouse.setCanvas = function(canvas)
{
	Mouse.canvas = canvas;

	canvas.mouseInside = false;

	canvas.addEventListener("mouseenter", function()
	{
		this.mouseInside = true;
	}, false);

	canvas.addEventListener("mouseleave", function()
	{
		this.mouseInside = false;
	}, false);
}

//Check if mouse is inside attached canvas
Mouse.insideCanvas = function()
{
	if(Mouse.canvas === null)
	{
		return false;
	}
	
	return Mouse.canvas.mouseInside;
}

//Set if mouse locked
Mouse.setLock = function(value)
{
	if(Mouse.canvas !== null)
	{
		if(value)
		{
			if(Mouse.canvas.requestPointerLock)
			{
				Mouse.canvas.requestPointerLock();
			}
			else if(Mouse.canvas.mozRequestPointerLock)
			{
				Mouse.canvas.mozRequestPointerLock();
			}
			else if(Mouse.canvas.webkitRequestPointerLock)
			{
				Mouse.canvas.webkitRequestPointerLock();
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

//Check if Mouse button is pressed
Mouse.buttonPressed = function(button)
{
	return Mouse.keys[button].isPressed;
}

//Check if a mouse button was just pressed
Mouse.buttonJustPressed = function(button)
{
	return Mouse.keys[button].justPressed;
}

//Check if a mouse button was just released
Mouse.buttonJustReleased = function(button)
{
	return Mouse.keys[button].justReleased;
}

//Update Mouse Position
Mouse.updatePosition = function(x, y, x_diff, y_diff)
{
	Mouse._position.set(x, y);
	Mouse._delta.x += x_diff;
	Mouse._delta.y += y_diff;
	Mouse._position_updated = true;
}

//Update Mouse Key
Mouse.updateKey = function(button, action)
{
	if(button > -1)
	{
		Mouse._keys[button].update(action);
	}
}

//Update Mouse State (Calculate position diff)
Mouse.update = function()
{
	//Update mouse keys state
	for(var i = 0; i < Mouse._keys.length; i++)
	{
		if(Mouse._keys[i].justPressed && Mouse.keys[i].justPressed)
		{
			Mouse._keys[i].justPressed = false;
		}
		if(Mouse._keys[i].justReleased && Mouse.keys[i].justReleased)
		{
			Mouse._keys[i].justReleased = false;
		}
		Mouse.keys[i].set(Mouse._keys[i].justPressed, Mouse._keys[i].isPressed, Mouse._keys[i].justReleased);
	}

	//Update mouse wheel
	if(Mouse._wheel_updated)
	{
		Mouse.wheel = Mouse._wheel;
		Mouse._wheel_updated = false;
	}
	else
	{
		Mouse.wheel = 0;
	}

	//Update mouse Position if needed
	if(Mouse._position_updated)
	{
		Mouse.delta.x = Mouse._delta.x;
		Mouse.delta.y = Mouse._delta.y;
		Mouse._delta.set(0,0);

		Mouse.position.x = Mouse._position.x;
		Mouse.position.y = Mouse._position.y;

		Mouse._position_updated = false;
	}
	else
	{
		Mouse.delta.x = 0;
		Mouse.delta.y = 0;
	}
}

//Return string with pointer information
Mouse.toString = function()
{
	return "Pos:" + Mouse.position.x + "," + Mouse.position.y + " Delta:" + Mouse.delta.toString() + "\n   Left: " + Mouse.keys[0].toString() + "\n   Middle: " + Mouse.keys[1].toString() + "\n   Right: " + Mouse.keys[2].toString();
}
