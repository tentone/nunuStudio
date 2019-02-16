"use strict";

/**
 * The viewport object is used to handle virtual visualization windows for the WebGL renderer.
 * 
 * It uses normalized coordinates [0 to 1] when using RELATIVE mode or pixel based coordinated for ABSOLUTE mode.
 * 
 * @class Viewport
 * @param {Number} mode
 */
function Viewport(mode)
{
	/**
	 * Camera viewport offset.
	 * 
	 * Values range from 0.0 to 1.0 in screen space when in RELATIVE mode.
	 * 
	 * @property offset
	 * @type {THREE.Vector2}
	*/
	this.offset = new THREE.Vector2(0.0, 0.0);

	/**
	 * Camera viewport size.
	 * 
	 * Values range from 0.0 to 1.0 in screen space.
	 * 
	 * @property viewport
	 * @type {THREE.Vector2}
	 */
	this.viewport = new THREE.Vector2(1.0, 1.0);

	/** 
	 * Viewport sizing mode.
	 * 
	 * Can be RELATIVE or ABSOLUTE.
	 *
	 * @property mode
	 * @type {Number}
	 */
	this.mode = mode !== undefined ? mode : Viewport.RELATIVE;

	/** 
	 * Positioning anchor of the viewport.
	 *
	 * @property anchor
	 * @type {Number}
	 */
	this.anchor = Viewport.TOP_LEFT;
}

/** 
 * Viewport calculated relatively to the screen viewport.
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
		return (this.viewport.x * canvas.width) / (this.viewport.y * canvas.height);
	}

	return this.viewport.x / this.viewport.y;
};

/**
 * Check if the mouse is inside this viewport.
 * 
 * @method isInside
 * @param {DOM} canvas Canvas for offset calculation.
 * @param {Mouse} mouse Mouse object.
 */
Viewport.prototype.isInside = function(canvas, mouse)
{
	if(this.mode === Viewport.RELATIVE)
	{
		var offset = new THREE.Vector2(this.offset.x * canvas.width, this.offset.y * canvas.height);
		var viewport = new THREE.Vector2(this.viewport.x * canvas.width, this.viewport.y * canvas.height);
	}
	else //if(this.mode === Viewport.ABSOLUTE)
	{
		var offset = this.offset;
		var viewport = this.viewport;
	}

	if(this.anchor === Viewport.TOP_LEFT)
	{
		return mouse.offset.x > offset.x &&
		mouse.offset.x < offset.x + viewport.x &&
		mouse.offset.y > offset.y &&
		mouse.offset.y < offset.y + viewport.y;
	}
	else if(this.anchor === Viewport.TOP_RIGHT)
	{
		return mouse.offset.x > canvas.width - viewport.x - offset.x &&
		mouse.offset.x < canvas.width - offset.x &&
		mouse.offset.y > offset.y &&
		mouse.offset.y < offset.y + viewport.y;
	}
	else if(this.anchor === Viewport.BOTTOM_LEFT)
	{
		return mouse.offset.x > offset.x &&
		mouse.offset.x < offset.x + viewport.x &&
		mouse.offset.y > canvas.height - offset.y - viewport.y &&
		mouse.offset.y < canvas.height - offset.y;
	}
	else //if(this.anchor === Viewport.BOTTOM_RIGHT)
	{
		return mouse.offset.x > canvas.width - viewport.x - offset.x &&
		mouse.offset.x < canvas.width - offset.x &&
		mouse.offset.y > canvas.height - offset.y - viewport.y &&
		mouse.offset.y < canvas.height - offset.y;
	}
};

/** 
 * Get normalized coordinates between [-1, 1] for a canvas size and mouse position.
 *
 * Usefull to use raycasting for object picking in a viewport.
 *
 * @method getNormalized
 * @return {THREE.Vector2} Normalized coordinated of the mouse.
 */
Viewport.prototype.getNormalized = function(canvas, mouse)
{
	var normalized = new THREE.Vector2();

	return function(canvas, mouse)
	{
		if(this.mode === Viewport.RELATIVE)
		{
			var offset = new THREE.Vector2(this.offset.x * canvas.width, this.offset.y * canvas.height);
			var viewport = new THREE.Vector2(this.viewport.x * canvas.width, this.viewport.y * canvas.height);
		}
		else //if(this.mode === Viewport.ABSOLUTE)
		{
			var offset = this.offset;
			var viewport = this.viewport;
		}

		if(this.anchor === Viewport.TOP_LEFT)
		{
			var x = mouse.offset.x - viewport.x - offset.x;
			var y = mouse.offset.y - offset.y;
			normalized.set((x / viewport.x) * 2 + 1, (-y / viewport.y) * 2 + 1);
		}
		else if(this.anchor === Viewport.TOP_RIGHT)
		{
			var x = canvas.width - mouse.offset.x - viewport.x - offset.x;
			var y = mouse.offset.y - offset.y;
			normalized.set((-x / viewport.x) * 2 - 1, (-y / viewport.y) * 2 + 1);
		}
		else if(this.anchor === Viewport.BOTTOM_LEFT)
		{
			var x = mouse.offset.x - viewport.x - offset.x;
			var y = canvas.height - mouse.offset.y - offset.y;
			normalized.set((x / viewport.x) * 2 + 1, (y / viewport.y) * 2 - 1);
		}
		else //if(this.anchor === Viewport.BOTTOM_RIGHT)
		{
			var x = canvas.width - mouse.offset.x - viewport.x - offset.x;
			var y = canvas.height - mouse.offset.y - offset.y;
			normalized.set((-x / viewport.x) * 2 - 1, (y / viewport.y) * 2 - 1);
		}
		
		return normalized;
	};
}();

/**
 * Enable this viewport for rendering using a WebGLRenderer
 *
 * After rendering the WebGL renderer has to manually reset to the original values.
 *
 * @method enable
 * @param {THREE.WebGLRenderer} renderer
 */
Viewport.prototype.enable = function(renderer)
{
	if(this.mode === Viewport.RELATIVE)
	{
		var offset = new THREE.Vector2(this.offset.x * renderer.domElement.width, this.offset.y * renderer.domElement.height);
		var viewport = new THREE.Vector2(this.viewport.x * renderer.domElement.width, this.viewport.y * renderer.domElement.height);
	}
	else //if(this.mode === Viewport.ABSOLUTE)
	{
		var offset = this.offset;
		var viewport = this.viewport;
	}

	if(this.anchor === Viewport.TOP_LEFT)
	{
		renderer.setViewport(offset.x, offset.y, viewport.x, viewport.y);
		renderer.setScissor(offset.x, offset.y, viewport.x, viewport.y);
	}
	else if(this.anchor === Viewport.TOP_RIGHT)
	{
		var x = renderer.domElement.width - viewport.x - offset.x;
		renderer.setViewport(x, offset.y, viewport.x, viewport.y);
		renderer.setScissor(x, offset.y, viewport.x, viewport.y);
	}
	else if(this.anchor === Viewport.BOTTOM_LEFT)
	{
		var y = renderer.domElement.height - viewport.y - offset.y;
		renderer.setViewport(offset.x, y, viewport.x, viewport.y);
		renderer.setScissor(offset.x, y, viewport.x, viewport.y);
	}
	else if(this.anchor === Viewport.BOTTOM_RIGHT)
	{
		var x = renderer.domElement.width - viewport.x - offset.x;
		var y = renderer.domElement.height - viewport.y - offset.y;
		renderer.setViewport(x, y, viewport.x, viewport.y);
		renderer.setScissor(x, y, viewport.x, viewport.y);
	}
};
