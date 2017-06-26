"use strict";

/**
 * TextureLoader can be used to load external textures.
 *
 * @constructor
 * @class TextureLoader
 * @module Loaders
 * @param {Object} manager
 */
function TextureLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;

	this.images = [];
	this.videos = [];
	this.fonts = [];
}

THREE.TextureLoader = TextureLoader;

TextureLoader.prototype.setCrossOrigin = function(url){};

TextureLoader.prototype.setPath = function(path){};

/**
 * Set list of images to be used by this loader.
 *
 * @method setImages
 * @param {Array} images
 */
TextureLoader.prototype.setImages = function(images)
{
	this.images = images;
	return this;
};

/**
 * Set list of videos to be used by this loader.
 *
 * @method setVideos
 * @param {Array} videos
 */
TextureLoader.prototype.setVideos = function(videos)
{
	this.videos = videos;
	return this;
};

/**
 * Set list of fonts to be used by this loader.
 *
 * @method setFonts
 * @param {Array} fonts
 */
TextureLoader.prototype.setFonts = function(fonts)
{
	this.fonts = fonts;
	return this;
};

/**
 * Load texture from URL.
 *
 * Does the same as creating a new Texture object.
 * 
 * @method load
 * @param {String} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
TextureLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var texture = new Texture(url);

	if(onLoad !== undefined)
	{
		onLoad(texture);
	}

	return texture;
};

/**
 * Load texture object from JSON.
 *
 * @method loadJSON
 * @param {String} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
TextureLoader.prototype.loadJSON = function(url, onLoad, onProgress, onError)
{
	var self = this;
	
	var loader = new THREE.FileLoader(this.manager);
	loader.load(url, function(text)
	{
		self.parse(JSON.parse(text), onLoad);
	}, onProgress, onError);
};

/**
 * Parse a texture object JSON description.
 *
 * @method parse
 * @param {String} url
 * @param {Function} onLoad
 */
TextureLoader.prototype.parse = function(json, onLoad)
{
	var texture = null;
	var category = json.category;

	//Video texture
	if(category === "Video")
	{
		if(json.video === undefined)
		{
			console.warn("TextureLoader: No video specified for", json.uuid);
		}

		if(this.videos[json.video] === undefined)
		{
			console.warn("TextureLoader: Undefined video", json.video);
		}

		texture = new VideoTexture(this.videos[json.video]);
		texture.setLoop(json.loop);
		texture.setAutoPlay(json.autoplay);
		texture.setPlaybackRate(json.playbackRate);
		texture.setVolume(json.volume);
	}
	//Webcam texture
	else if(category === "Webcam")
	{
		texture = new WebcamTexture();
	}
	//Cube texture
	else if(category === "Cube")
	{
		var images = [];

		for(var i = 0; i < json.images.length; i++)
		{
			if(this.images[json.images[i]] === undefined)
			{
				console.warn("nunuStudio: TextureLoader, undefined image", json.images[i]);
			}

			images.push(this.images[json.images[i]]);
		}

		texture = new CubeTexture();
		texture.setImages(images, json.mode);
		texture.setSize(json.size);
		texture.updateImages();
	}
	//Canvas texture
	else if(category === "Canvas")
	{
		texture = new CanvasTexture(json.width, json.height);
	}
	//Texture
	else
	{
		if(json.image === undefined)
		{
			console.warn("nunuStudio: TextureLoader, no image specified for", json.uuid);
		}

		if(this.images[json.image] === undefined)
		{
			console.warn("nunuStudio: TextureLoader, undefined image", json.image);
		}

		//SpriteSheet texture
		if(category === "SpriteSheet")
		{
			texture = new SpriteSheetTexture(this.images[json.image], json.framesHorizontal, json.framesVertical, json.totalFrames);
			texture.loop = json.loop;
			texture.animationSpeed = json.animationSpeed;
			texture.beginFrame = json.beginFrame;
			texture.endFrame = json.endFrame;
		}
		//Texture
		else
		{
			texture = new Texture(this.images[json.image]);
		}
	}

	texture.uuid = json.uuid;
	texture.name = json.name;
	texture.mapping = json.mapping;

	texture.offset = new THREE.Vector2(json.offset[0], json.offset[1]);
	texture.repeat = new THREE.Vector2(json.repeat[0], json.repeat[1]);
	texture.wrapS = json.wrap[0];
	texture.wrapT = json.wrap[1];

	texture.minFilter = json.minFilter;
	texture.magFilter = json.magFilter;

	texture.anisotropy = json.anisotropy;
	texture.flipY = json.flipY;

	if(onLoad !== undefined)
	{
		onLoad(texture);
	}

	return texture;
};
