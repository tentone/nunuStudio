"use strict";

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
function SpriteSheetTexture(image, framesHorizontal, framesVertical, totalFrames, mapping, type, anisotropy)
{
	if(typeof image === "string")
	{
		this.img = new Image(image);
	}
	else if(image instanceof Image)
	{
		this.img = image;
	}

	THREE.Texture.call(this, document.createElement("img"), mapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFormat, type, anisotropy);

	this.matrixAutoUpdate = true;
	this.name = "animation";
	this.category = "SpriteSheet";
	this.disposed = false;
	this.format = this.img.hasTransparency() ? THREE.RGBAFormat : THREE.RGBFormat;
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
				return self._framesHorizontal;
			},
			set: function(value)
			{
				self._framesHorizontal = value;
				self.repeat.x = 1 / value;
				self.totalFrames = self._framesHorizontal * self._framesVertical;
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
				return self._framesVertical;
			},
			set: function(value)
			{
				self._framesVertical = value;
				self.repeat.y = 1 / value;
				self.totalFrames = self._framesHorizontal * self._framesVertical;
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
				return self._endFrame;
			},
			set: function(value)
			{
				if(value > self._totalFrames)
				{
					value = self._totalFrames;
				}
				self._endFrame = value;
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
				return self._beginFrame;
			},
			set: function(value)
			{
				if(value < 0)
				{
					value = 0;
				}
				self.currentFrame = value;
				self._beginFrame = value;
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
				return self._totalFrames;
			},
			set: function(value)
			{
				self._beginFrame = 0;
				self._endFrame = value;
				self._totalFrames = value;
			}
		}
	});

	/**
	 * DOM element attached to the texture
	 * 
	 * @property image
	 * @type {Element}
	 */
	this.image.crossOrigin = "anonymous";
	this.image.src = this.img.data;
	this.image.onload = function()
	{
		self.needsUpdate = true;
	}
	
	/**
	 * Indicates the current frame of the animation.
	 *
	 * @property currentFrame
	 * @type {number}
	 */
	this.currentFrame = 0;

	function update()
	{
		self.currentFrame++;

		if(self.currentFrame >= self._endFrame)
		{
			self.currentFrame = self._beginFrame;
		}

		self.offset.x = (self.currentFrame % self.framesHorizontal) / self.framesHorizontal;
		self.offset.y = (1 - self.repeat.y) - Math.floor(self.currentFrame / self.framesHorizontal) / self.framesVertical;
		self.needsUpdate = true;

		if(!self.disposed)
		{
			setTimeout(update, self.animationSpeed * 1000);
		}
	};
	update();
}

SpriteSheetTexture.prototype = Object.create(THREE.Texture.prototype);

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
	THREE.Texture.prototype.dispose.call(this);

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
	var data = THREE.Texture.prototype.toJSON.call(this, meta);
	var image = this.img.toJSON(meta);

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
