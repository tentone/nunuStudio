"use strict";

/**
 * SpriteSheet texture, can be used load spritesheet animations as textures.
 *
 * Images are played row by row, changing every animationSpeed seconds.
 * 
 * @class SpriteSheetTexture
 * @constructor
 * @extends {Texture}
 * @module Textures
 * @param {Image} image
 * @param {Number} framesHorizontal
 * @param {Number} framesVertical
 * @param {Number} totalFrames
 * @param {Number} mapping
 * @param {Number} type
 * @param {Number} anisotropy
 */

/**
 * If true the animation plays in loop.
 * @property loop
 * @default true
 * @type {boolean}
*/
/**
 * Animation speed in seconds.
 * @property animationSpeed
 * @default 0.1
 * @type {Number}
*/
/**
 * Spritesheet number of frames horizontally.
 * @property framesHorizontal
 * @default 1.0
 * @type {Number}
*/
/**
 * Spritesheet number of frames vertically.
 * @property framesVertical
 * @default 1.0
 * @type {Number}
*/
/**
 * Total number of frames present in the texture.
 *
 * Sometimes a NxM spritesheet doest not have all spaces filled, this parameter is used to take care of those cases.
 * @property totalFrames
 * @default 1
 * @type {Number}
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

	//Super constructor
	THREE.Texture.call(this, document.createElement("img"), mapping, THREE.RepeatWrapping, THREE.RepeatWrapping, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFormat, type, anisotropy);

	//Name
	this.name = "animation";
	this.category = "SpriteSheet";
	this.disposed = false;

	//Animation
	this.loop = true;
	this.animationSpeed = 0.1;
	this.totalFrames = totalFrames;
	this._framesHorizontal = framesHorizontal;
	this._framesVertical = framesVertical;

	//Runtime
	this.repeat.set(1 / this._framesHorizontal, 1 / this._framesVertical);
	this.currentFrame = 0;

	var self = this;
	Object.defineProperties(this,
	{
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
			}
		},
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
			}
		}
	});


	//Image source
	this.image.src = this.img.data;
	this.image.onload = function()
	{
		self.needsUpdate = true;
	}
	
	//Update loop
	function update()
	{
		self.currentFrame++;
		if(self.currentFrame >= self.totalFrames)
		{
			self.currentFrame = 0;
		}

		self.offset.x = (self.currentFrame % self.framesHorizontal) / self.framesHorizontal;
		self.offset.y = Math.floor(self.currentFrame / self.framesHorizontal) / self.framesVertical;

		if(!self.disposed)
		{
			setTimeout(update, self.animationSpeed * 1000);
		}
	};

	update();
}

SpriteSheetTexture.prototype = Object.create(THREE.Texture.prototype);

/**
 * Set video playback speed.
 * 
 * @method setPlaybackRate
 * @param {Number} playbackRate
 */
SpriteSheetTexture.prototype.setAnimationSpeed = function(playbackRate)
{
	this.animationSpeed = animationSpeed;
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
	data.totalFrames = this.totalFrames;

	return data;
};
