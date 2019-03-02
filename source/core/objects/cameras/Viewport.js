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
	 * Values range from 0.0 to 1.0 in screen space when in RELATIVE mode.
	 * 
	 * @property size
	 * @type {THREE.Vector2}
	 */
	this.size = new THREE.Vector2(1.0, 1.0);

	/**
	 * Width of the final output canvas.
	 *
	 * This width should match the canvas size / rendering resolution.
	 *
	 * @property width
	 * @type {Number}
	 */
	this.width = 1;

	/**
	 * Height of the final output canvas.
	 *
	 * This height should match the canvas size / rendering resolution.
	 *
	 * @property height
	 * @type {Number}
	 */
	this.height = 1;

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

	/**
	 * Calculated absolute viewport values (x, y, width, height) stored in a vector.
	 *
	 * It is calculated using the update() method that should be called after applying changes.
	 *
	 * @property viewport
	 * @type {THREE.Vector4}
	 */
	this.viewport = new THREE.Vector4();
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
 * Update the viewport box from the values.
 *
 * Has to be called after applying changes to the viewport, the viewport is resized of the 
 *
 * @method update
 * @param {Viewport} container Viewport that contains this viewport.
 */
Viewport.prototype.update = function(container)
{
	var width, height;
	var x, y;

	if(container === undefined)
	{
		width = this.width;
		height = this.height;
		x = 0;
		y = 0;
	}
	else
	{
		width = container.viewport.z;
		height = container.viewport.w;
		x = container.viewport.x;
		y = container.viewport.y;
	}

	var offset, viewport;

	if(this.mode === Viewport.RELATIVE)
	{
		offset = new THREE.Vector2(this.offset.x * width, this.offset.y * height);
		viewport = new THREE.Vector2(this.size.x * width, this.size.y * height);
	}
	else if(this.mode === Viewport.ABSOLUTE)
	{
		offset = this.offset;
		viewport = this.size;
	}

	if(this.anchor === Viewport.BOTTOM_LEFT)
	{
		this.viewport.set(offset.x + x, offset.y + y, viewport.x, viewport.y);
	}
	else if(this.anchor === Viewport.BOTTOM_RIGHT)
	{
		this.viewport.set(width - viewport.x - offset.x + x, offset.y + y, viewport.x, viewport.y);
	}
	else if(this.anchor === Viewport.TOP_LEFT)
	{
		this.viewport.set(offset.x + x, height - viewport.y - offset.y + y, viewport.x, viewport.y);
	}
	else if(this.anchor === Viewport.TOP_RIGHT)
	{
		this.viewport.set(width - viewport.x - offset.x + x, height - viewport.y - offset.y + y, viewport.x, viewport.y);
	}
};

/**
 * Get the aspect ratio of this viewport x/y.
 * 
 * @method getAspectRatio
 * @param {Canvas} canvas DOM canvas only required to calculate aspect ration on relative sizing.
 * @return {Number} The aspect ratio of the viewport.
 */
Viewport.prototype.getAspectRatio = function()
{
	return this.size.x / this.size.y;
};

/**
 * Check if the mouse is inside this viewport.
 * 
 * @method isInside
 * @param {DOM} canvas Canvas for offset calculation.
 * @param {Mouse} mouse Mouse object with coordinates inside of the canvas.
 */
Viewport.prototype.isInside = function(canvas, mouse)
{
	return mouse.position.x > this.viewport.x &&
	mouse.position.x < this.viewport.x + this.viewport.z &&
	mouse.position.y < this.height - this.viewport.y &&
	mouse.position.y > this.height - this.viewport.y - this.viewport.w;
};

/** 
 * Get normalized coordinates between [-1, 1] for a canvas size and mouse position.
 *
 * Usefull to use raycasting for object picking in a viewport.
 *
 * @method getNormalized
 * @param {DOM} canvas Canvas for offset calculation.
 * @param {Mouse} mouse Mouse object with coordinates inside of the canvas.
 * @return {THREE.Vector2} Normalized coordinated of the mouse.
 */
Viewport.prototype.getNormalized = function()
{
	var normalized = new THREE.Vector2();

	return function(canvas, mouse)
	{
		//TODO <REMOVE LATER>
		this.width = canvas.width;
		this.height = canvas.height;
		this.update();

		var x = mouse.position.x - this.viewport.z - this.viewport.x;
		var y = mouse.position.y - (this.height - (this.viewport.y + this.viewport.w));

		normalized.set((x / this.viewport.z) * 2 + 1, (-y / this.viewport.w) * 2 + 1);

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
	renderer.setViewport(this.viewport);
	renderer.setScissor(this.viewport);
};

/**
 * Serializer viewport data to JSON.
 *
 * @method toJSON
 * @return {Object} Serialized viewport object.
 */
Viewport.prototype.toJSON = function()
{
	var data = 
	{
		offset: this.offset.toArray(),
		size: this.size.toArray(),
		mode: this.mode,
		anchor: this.anchor
	};

	return data;
};

/**
 * Fill viewport data from serialized JSON data.
 *
 * @method toJSON
 * @param {Object} data Serialized viewport object.
 */
Viewport.prototype.fromJSON = function(data)
{
	this.offset.fromArray(data.offset);
	this.size.fromArray(data.size);
	this.mode = data.mode;
	this.anchor = data.anchor;
};
