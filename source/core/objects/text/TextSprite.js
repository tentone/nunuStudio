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
 */
function TextSprite()
{
	CanvasSprite.call(this);
	
	this.name = "text";
	this.type = "TextSprite";
	
	var text = "";
	var color = "#FFFFFF";
	var outline = true;
	var outlineColor = "#000000";
	var outlineWidth = 1;
	var resolution = 32;
	var align = TextSprite.CENTER;
	var font = "arial";

	Object.defineProperties(this,
	{
		/**
		 * CSS Font style to be used.
		 * 
		 * @attribute font
		 * @type {String}
		 */
		font:
		{
			get: function(){return font;},
			set: function(value){font = value; this.drawText();}
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
			get: function(){return align;},
			set: function(value){align = value; this.drawText();}
		},

		/**
		 * CSS color of the text.
		 * 
		 * @attribute color
		 * @type {String}
		 */
		color:
		{
			get: function(){return color;},
			set: function(value){color = value; this.drawText();}
		},

		/**
		 * Text of this object.
		 * 
		 * @attribute text
		 * @type {String}
		 */
		text:
		{
			get: function(){return text;},
			set: function(value)
			{
				if(value !== text)
				{
					text = value;
					this.drawText();
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
			get: function(){return outline;},
			set: function(value){outline = value; this.drawText();}
		},

		/**
		 * CSS color of the outline.
		 * 
		 * @attribute outlineColor
		 * @type {String}
		 */
		outlineColor:
		{
			get: function(){return outlineColor;},
			set: function(value){outlineColor = value; this.drawText();}
		},

		/**
		 * Width of the text outline.
		 * 
		 * @attribute outlineWidth
		 * @type {Number}
		 */
		outlineWidth:
		{
			get: function(){return outlineWidth;},
			set: function(value){outlineWidth = value; this.drawText();}
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
			get: function(){return resolution;},
			set: function(value){resolution = value; this.drawText();}
		}
	});

	this.text = "text";
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
 * Update the canvas texture, redrawText text into the canvas.
 *
 * @method drawText
 */
TextSprite.prototype.drawText = function()
{
	var height = this.resolution;
	var fontSize = height * 0.8;

	var context = this.texture.context;
	context.font = fontSize + "px " + this.font;

	var size = context.measureText(this.text).width;
	var width = THREE.Math.ceilPowerOfTwo(size);
	var ratio = width / height;

	this.width = width;
	this.height = height;

	context.clearRect(0, 0, width, height);
	
	if(this.text.length === 0)
	{
		return;
	}

	context.font = fontSize + "px " + this.font;
	context.textAlign = this.align;
	context.textBaseline = "middle";
	context.fillStyle = this.color;
	context.fillText(this.text, width / 2, height / 2);
	
	if(this.outline === true)
	{
		context.lineWidth = this.outlineWidth;
		context.strokeStyle = this.outlineColor;
		context.strokeText(this.text, width / 2, height / 2);
	}

	this.scale.x = ratio * this.scale.y;


	this.texture.needsUpdate = true;
};

TextSprite.prototype.toJSON = function(meta)
{
	var data = THREE.Object3D.prototype.toJSON.call(this, meta);

	data.object.text = this.text;
	data.object.color = this.color;
	data.object.outline = this.outline;
	data.object.outlineColor = this.outlineColor;
	data.object.outlineWidth = this.outlineWidth;
	data.object.resolution = this.resolution;
	data.object.align = this.align;
	data.object.font = this.font;

	return data;
};
