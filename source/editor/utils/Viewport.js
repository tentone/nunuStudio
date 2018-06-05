"use strict";

/**
 * The viewport object is used to handle virtual visualization windows.
 * 
 * It uses normalized coordinated [0 to 1].
 * 
 * @class Viewport
 */
function Viewport(mode)
{
	this.position = new THREE.Vector2(0.0, 0.0);
	this.size = new THREE.Vector2(1.0, 1.0);

	this.mode = mode !== undefined ? mode : Viewport.RELATIVE;
	this.anchor = Viewport.TOP_LEFT;
}

/** 
 * Viewport calculated relatively to the screen size.
 * 
 * @static
 * @attribute RELATIVE
 */
Viewport.RELATIVE = 200;

/** 
 * Viewport defined absolutely in pixels.
 * 
 * @static
 * @attribute ABSOLUTE
 */
Viewport.ABSOLUTE = 201;

Viewport.TOP_LEFT = 301;
Viewport.TOP_RIGHT = 302;
Viewport.BOTTOM_LEFT = 303;
Viewport.BOTTOM_RIGHT = 304;

/**
 * Get the aspect ratio of this viewport x/y.
 * 
 * @method getAspectRatio
 * @param {Canvas} canvas DOM canvas only required to calculate aspect ration on relative sizing.
 * @return {Number} The aspect ratio of the viewport.
 */
Viewport.prototype.getAspectRatio = function(canvas)
{
	if(this.mode === Viewport.RELATIVE)
	{
		return (this.size.x * canvas.width) / (this.size.y * canvas.height);
	}

	return this.size.x / this.size.y;
};

/**
 * Check if the mouse is inside this viewport.
 * 
 * @method isInside
 * @param {DOM} canvas Canvas for position calculation.
 * @param {Mouse} mouse Mouse object.
 */
Viewport.prototype.isInside = function(canvas, mouse)
{
	if(this.mode === Viewport.RELATIVE)
	{
		var position = new THREE.Vector2(this.position.x * canvas.width, this.position.y * canvas.height);
		var size = new THREE.Vector2(this.size.x * canvas.width, this.size.y * canvas.height);
	}
	else //Viewport.ABSOLUTE
	{
		var position = this.position;
		var size = this.size;
	}

	if(this.anchor === Viewport.TOP_LEFT)
	{
		return mouse.position.x > position.x &&
		mouse.position.x < position.x + size.x &&
		mouse.position.y > position.y &&
		mouse.position.y < position.y + size.y;
	}
	else if(this.anchor === Viewport.TOP_RIGHT)
	{
		return mouse.position.x > canvas.width - size.x - position.x &&
		mouse.position.x < canvas.width - position.x &&
		mouse.position.y > position.y &&
		mouse.position.y < position.y + size.y;
	}
	else if(this.anchor === Viewport.BOTTOM_LEFT)
	{
		return mouse.position.x > position.x &&
		mouse.position.x < position.x + size.x &&
		mouse.position.y > canvas.height - position.y - size.y &&
		mouse.position.y < canvas.height - position.y;
	}
	else //Viewport.BOTTOM_RIGHT
	{
		return mouse.position.x > canvas.width - size.x - position.x &&
		mouse.position.x < canvas.width - position.x &&
		mouse.position.y > canvas.height - position.y - size.y &&
		mouse.position.y < canvas.height - position.y;
	}
};

Viewport.prototype.getNormalized = function(canvas, mouse)
{
	var normalized = new THREE.Vector2();

	return function(canvas, mouse)
	{
		if(this.mode === Viewport.RELATIVE)
		{
			var position = new THREE.Vector2(this.position.x * canvas.width, this.position.y * canvas.height);
			var size = new THREE.Vector2(this.size.x * canvas.width, this.size.y * canvas.height);
		}
		else //Viewport.ABSOLUTE
		{
			var position = this.position;
			var size = this.size;
		}

		if(this.anchor === Viewport.TOP_LEFT)
		{
			var x = mouse.position.x - size.x - position.x;
			var y = mouse.position.y - position.y;
			normalized.set((x / size.x) * 2 + 1, (-y / size.y) * 2 + 1);
		}
		else if(this.anchor === Viewport.TOP_RIGHT)
		{
			var x = canvas.width - mouse.position.x - size.x - position.x;
			var y = mouse.position.y - position.y;
			normalized.set((-x / size.x) * 2 - 1, (-y / size.y) * 2 + 1);
		}
		else if(this.anchor === Viewport.BOTTOM_LEFT)
		{
			var x = mouse.position.x - size.x - position.x;
			var y = canvas.height - mouse.position.y - position.y;
			normalized.set((x / size.x) * 2 + 1, (y / size.y) * 2 - 1);
		}
		else //Viewport.BOTTOM_RIGHT
		{
			var x = canvas.width - mouse.position.x - size.x - position.x;
			var y = canvas.height - mouse.position.y - position.y;
			normalized.set((-x / size.x) * 2 - 1, (y / size.y) * 2 - 1);
		}
		
		return normalized;
	};
}();

/**
 * Enable this viewport for rendering.
 *
 * @method enable
 * @param {THREE.WebGLRenderer} renderer
 */
Viewport.prototype.enable = function(renderer)
{
	if(this.mode === Viewport.RELATIVE)
	{
		var position = new THREE.Vector2(this.position.x * renderer.domElement.width, this.position.y * renderer.domElement.height);
		var size = new THREE.Vector2(this.size.x * renderer.domElement.width, this.size.y * renderer.domElement.height);
	}
	else //Viewport.ABSOLUTE
	{
		var position = this.position;
		var size = this.size;
	}

	if(this.anchor === Viewport.TOP_LEFT)
	{
		renderer.setViewport(position.x, position.y, size.x, size.y);
		renderer.setScissor(position.x, position.y, size.x, size.y);
	}
	else if(this.anchor === Viewport.TOP_RIGHT)
	{
		var x = renderer.domElement.width - size.x - position.x;
		renderer.setViewport(x, position.y, size.x, size.y);
		renderer.setScissor(x, position.y, size.x, size.y);
	}
	else if(this.anchor === Viewport.BOTTOM_LEFT)
	{
		var y = renderer.domElement.height - size.y - position.y;
		renderer.setViewport(position.x, y, size.x, size.y);
		renderer.setScissor(position.x, y, size.x, size.y);
	}
	else if(this.anchor === Viewport.BOTTOM_RIGHT)
	{
		var x = renderer.domElement.width - size.x - position.x;
		var y = renderer.domElement.height - size.y - position.y;
		renderer.setViewport(x, y, size.x, size.y);
		renderer.setScissor(x, y, size.x, size.y);
	}
};
