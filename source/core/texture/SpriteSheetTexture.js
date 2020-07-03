import {Image} from "../resources/Image.js";
import {RepeatWrapping, LinearFilter, RGBFormat, RGBAFormat, Texture} from "three";

/**
 * SpriteSheet texture, can be used load spritesheet animations as textures.
 *
 * The images have to be aligned in a grid without overlapping if the spritesheet is not full the last rows or blocks should be empty.
 * 
 * Images are played row by row, changing every animationSpeed seconds.
 * 
 * @class SpriteSheetTexture
 * @extends {Texture}
 * @module Textures
 * @param {Image} image
 * @param {number} framesHorizontal
 * @param {number} framesVertical
 * @param {number} totalFrames
 * @param {number} mapping
 * @param {number} type
 * @param {number} anisotropy
 */
function SpriteSheetTexture(source, framesHorizontal, framesVertical, totalFrames, mapping, type, anisotropy)
{
	Texture.call(this, source, mapping, RepeatWrapping, RepeatWrapping, LinearFilter, LinearFilter, RGBFormat, type, anisotropy);

	this.name = "animation";
	this.category = "SpriteSheet";
	this.disposed = false;
	this.format = this.source.hasTransparency() ? RGBAFormat : RGBFormat;
	this.repeat.set(1 / framesHorizontal, 1 / framesVertical);

	/**
	 * If true the animation plays in loop.
	 * @property loop
	 * @default true
	 * @type {boolean}
	*/
	this.loop = true;

	/**
	 * Animation speed in seconds.
	 * @property animationSpeed
	 * @default 0.1
	 * @type {number}
	*/
	this.animationSpeed = 0.1;

	this._totalFrames = totalFrames;
	this._beginFrame = 0;
	this._endFrame = 0;
	this._framesHorizontal = framesHorizontal;
	this._framesVertical = framesVertical;

	var self = this;

	Object.defineProperties(this,
	{
		/**
		 * Spritesheet number of frames horizontally.
		 *
		 * When this values is changed the totalFrames value is automatically updated to framesHorizontal * framesVertical.
		 * @property framesHorizontal
		 * @default 1.0
		 * @type {number}
		*/
		framesHorizontal:
		{
			get: function()
			{
				return this._framesHorizontal;
			},
			set: function(value)
			{
				this._framesHorizontal = value;
				this.repeat.x = 1 / value;
				this.totalFrames = this._framesHorizontal * this._framesVertical;
			}
		},

		/**
		 * Spritesheet number of frames vertically.
		 *
		 * When this values is changed the totalFrames value is automatically updated to framesHorizontal * framesVertical.
		 * @property framesVertical
		 * @default 1.0
		 * @type {number}
		*/
		framesVertical:
		{
			get: function()
			{
				return this._framesVertical;
			},
			set: function(value)
			{
				this._framesVertical = value;
				this.repeat.y = 1 / value;
				this.totalFrames = this._framesHorizontal * this._framesVertical;
			}
		},

		/**
		 * The offset frame can be ajusted to control in which frame the animation ends.
		 * 
		 * @property endFrame
		 * @type {number}
		 */
		endFrame:
		{
			get: function()
			{
				return this._endFrame;
			},
			set: function(value)
			{
				if(value > this._totalFrames)
				{
					value = this._totalFrames;
				}
				this._endFrame = value;
			}
		},

		/**
		 * The offset frame can be ajusted to control in which frame the animation starts.
		 * 
		 * @property beginFrame
		 * @default 0
		 * @type {number}
		 */
		beginFrame:
		{
			get: function()
			{
				return this._beginFrame;
			},
			set: function(value)
			{
				if(value < 0)
				{
					value = 0;
				}
				this.currentFrame = value;
				this._beginFrame = value;
			}
		},

		/**
		 * Total number of frames present in the texture.
		 * 
		 * Sometimes a NxM spritesheet does not have all spaces filled, this parameter is used to take care of those cases.
		 * @property totalFrames
		 * @default 1
		 * @type {number}
		*/
		totalFrames:
		{
			get: function()
			{
				return this._totalFrames;
			},
			set: function(value)
			{
				this._beginFrame = 0;
				this._endFrame = value;
				this._totalFrames = value;
			}
		}
	});

	/**
	 * Indicates the current frame of the animation.
	 *
	 * @property currentFrame
	 * @type {number}
	 */
	this.currentFrame = 0;

	function update()
	{
		if(!self.disposed)
		{
			self.step();
			setTimeout(update, self.animationSpeed * 1e3);
		}
	};

	update();
}

SpriteSheetTexture.prototype = Object.create(Texture.prototype);
SpriteSheetTexture.isTexture = true;

/**
 * Step the sprite sheet animation, move to next frame and recalculate the texture offset.
 *
 * @method step
 */
SpriteSheetTexture.prototype.step = function()
{
	this.currentFrame++;

	if(this.currentFrame >= this._endFrame)
	{
		this.currentFrame = this._beginFrame;
	}

	this.offset.x = (this.currentFrame % this.framesHorizontal) / this.framesHorizontal;
	this.offset.y = (1 - this.repeat.y) - Math.floor(this.currentFrame / this.framesHorizontal) / this.framesVertical;
};


/**
 * Set animation playback speed.
 * 
 * @method setAnimationSpeed
 * @param {number} animationSpeed
 */
SpriteSheetTexture.prototype.setAnimationSpeed = function(animationSpeed)
{
	this.animationSpeed = animationSpeed;
};

/**
 * Set the sprite sheet grid dimension.
 *
 * Automatically sets the totalFrame value to framesHorizontal * framesVertical.
 * 	
 * @method setFrameGrid
 * @param {number} framesHorizontal
 * @param {number} framesVertical
 */
SpriteSheetTexture.prototype.setFrameGrid = function(framesHorizontal, framesVertical)
{
	this._framesHorizontal = framesHorizontal;
	this._framesVertical = framesVertical;
	this._totalFrames = framesHorizontal * framesVertical;
	this.repeat.set(1 / framesHorizontal, 1 / framesVertical);
};

/**
 * Set frames to be used for this animation.
 *
 * Frame starts counting from 0.
 * 
 * @method setAnimationFrames
 * @param {number} beginFrame
 * @param {number} endFrame
 */
SpriteSheetTexture.prototype.setAnimationFrames = function(beginFrame, endFrame)
{
	this.beginFrame = beginFrame;
	this.endFrame = endFrame;
};

/**
 * Dispose spritesheet texture.
 *
 * @method dispose
 */
SpriteSheetTexture.prototype.dispose = function()
{
	Texture.prototype.dispose.call(this);

	this.disposed = true;
};

/**
 * Create texture json description.
 *
 * @method toJSON
 * @param {Object} meta
 * @return {Object} json
 */
SpriteSheetTexture.prototype.toJSON = function(meta)
{
	var data = Texture.prototype.toJSON.call(this, meta);
	var image = this.source.toJSON(meta);

	data.image = image.uuid;
	data.loop = this.loop;
	data.animationSpeed = this.animationSpeed;
	data.framesHorizontal = this._framesHorizontal;
	data.framesVertical = this._framesVertical;
	data.totalFrames = this._totalFrames;
	data.beginFrame = this._beginFrame;
	data.endFrame = this._endFrame;

	return data;
};
export {SpriteSheetTexture};