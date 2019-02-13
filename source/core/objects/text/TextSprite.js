"use strict";

/**
 * Text sprite is used to represent text as a sprite.
 * 
 * This approach is memory expensive since it needs to write a new texture for each text. But allows the used to access any font available in the browser.
 *
 * The text is rendered to canvas and then copied to a texture. It automatically ajusts the object scale to match the text aspect.
 * 
 * @class TextSprite
 * @extends {CanvasSprite}
 * @param {String} text Text to draw in the sprite.
 */
function TextSprite(text)
{
	CanvasSprite.call(this);
	
	this.name = "text";
	this.type = "TextSprite";
	
	var textValue = "";
	var colorValue = "#FFFFFF";
	var outlineValue = true;
	var outlineColorValue = "#000000";
	var outlineWidthValue = 1;
	var resolutionValue = 32;
	var alignValue = TextSprite.CENTER;
	var fontValue = "arial";
	var sizeValue = 0.05;

	Object.defineProperties(this,
	{
		/**
		 * Scale of the object.
		 * 
		 * @attribute size
		 * @type {Number}
		 */
		size:
		{
			get: function(){return sizeValue;},
			set: function(value){sizeValue = value; this.updateCanvas();}
		},

		/**
		 * CSS Font style to be used.
		 * 
		 * @attribute font
		 * @type {String}
		 */
		font:
		{
			get: function(){return fontValue;},
			set: function(value){fontValue = value; this.updateCanvas();}
		},

		/**
		 * Horizontal text alignment can be
		 *    - TextSprite.LEFT
		 *    - TextSprite.RIGHT
		 *    - TextSprite.CENTER
		 *
		 * @attribute align
		 * @type {String}
		 */
		align:
		{
			get: function(){return alignValue;},
			set: function(value){alignValue = value; this.updateCanvas();}
		},

		/**
		 * CSS color of the text.
		 * 
		 * @attribute color
		 * @type {String}
		 */
		color:
		{
			get: function(){return colorValue;},
			set: function(value){colorValue = value; this.updateCanvas();}
		},

		/**
		 * Text of this object.
		 * 
		 * @attribute text
		 * @type {String}
		 */
		text:
		{
			get: function(){return textValue;},
			set: function(value)
			{
				if(value !== textValue)
				{
					textValue = value;
					this.updateCanvas();
				}
			}
		},

		/**
		 * Indicates if the text has an outline border.
		 * 
		 * @attribute outline
		 * @type {Boolean}
		 */
		outline:
		{
			get: function(){return outlineValue;},
			set: function(value){outlineValue = value; this.updateCanvas();}
		},

		/**
		 * CSS color of the outline.
		 * 
		 * @attribute outlineColor
		 * @type {String}
		 */
		outlineColor:
		{
			get: function(){return outlineColorValue;},
			set: function(value){outlineColorValue = value; this.updateCanvas();}
		},

		/**
		 * Width of the text outline.
		 * 
		 * @attribute outlineWidth
		 * @type {Number}
		 */
		outlineWidth:
		{
			get: function(){return outlineWidthValue;},
			set: function(value){outlineWidthValue = value; this.updateCanvas();}
		},

		/**
		 * Vertical resolution of the texture created from canvas used.
		 * 
		 * Should always be a npot of 2.
		 *
		 * @attribute resolution
		 * @type {Number}
		 */
		resolution:
		{
			get: function(){return resolutionValue;},
			set: function(value){resolutionValue = value; this.updateCanvas();}
		}
	});

	if(text !== undefined)
	{
		this.text = text;
	}
}

TextSprite.prototype = Object.create(CanvasSprite.prototype);

/**
 * Align text to the left side.
 *
 * @static
 * @attribute LEFT
 * @type {String}
 */
TextSprite.LEFT = "left";

/**
 * Align text to the center.
 *
 * @static
 * @attribute CENTER
 * @type {String}
 */
TextSprite.CENTER = "center";

/**
 * Align text to the right side.
 *
 * @static
 * @attribute RIGHT
 * @type {String}
 */
TextSprite.RIGHT = "right";

/**
 * Set the text to be displayed.
 *
 * @method setText
 * @param {String} text
 */
TextSprite.prototype.setText = function(text)
{
	this.text = text;
};

/**
 * Update the canvas texture.
 * 
 * Redraw text into the canvas and update scale.
 *
 * @method updateCanvas
 */
TextSprite.prototype.updateCanvas = function()
{
	var height = this.resolution;
	var fontSize = height * 0.8;

	var context = this.canvas.getContext("2d");
	context.font = fontSize + "px " + this.font;

	var size = context.measureText(this.text).width;
	var width = THREE.Math.ceilPowerOfTwo(size);
	var ratio = width / height;

	this.canvas.width = width;
	this.canvas.height = height;

	context.font = fontSize + "px " + this.font;
	context.textAlign = this.align;
	context.textBaseline = "middle";
	context.fillStyle = this.color;
	
	context.clearRect(0, 0, width, height);
	context.fillText(this.text, width / 2, height / 2);
	
	if(this.outline === true)
	{
		context.lineWidth = this.outlineWidth;
		context.strokeStyle = this.outlineColor;
		context.strokeText(this.text, width / 2, height / 2);
	}

	this.scale.set(ratio * this.size, this.size, this.size);
	this.updateWorldMatrix(true);
	this.texture.needsUpdate = true;
};
