"use strict";

/**
 * TextureLoader can be used to load external textures.
 *
 * @class TextureLoader
 * @module Loaders
 * @param {Object} manager
 */
function TextureLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
	
	this.path = "";
	this.crossOrigin = "anonymous";

	this.images = [];
	this.videos = [];
	this.fonts = [];
}

THREE._TextureLoader = THREE.TextureLoader;
THREE.TextureLoader = TextureLoader;

/**
 * Set cross origin path for the loader.
 * 
 * @method setCrossOrigin
 * @param {string} url URL.
 * @return {TextureLoader} Self for chaining.
 */
TextureLoader.prototype.setCrossOrigin = function(url)
{
	this.crossOrigin = url;
	return this;
};

/**
 * Set base path for texture loading.
 * 
 * @method setPath
 * @param {string} path Path
 * @return {TextureLoader} Self for chaining.
 */
TextureLoader.prototype.setPath = function(path)
{
	this.path = path;
	return this;
};

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
 * @param {string} url
 * @param {Function} onLoad
 * @param {Function} onProgress
 * @param {Function} onError
 */
TextureLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	try
	{
		var texture = new Texture(this.path + url);

		if(onLoad !== undefined)
		{
			onLoad(texture);
		}

		return texture;
	}
	catch(e)
	{
		if(onError !== undefined)
		{
			onError(e);
		}

		console.warn("nunuStudio: Texture not found", e);
		return new Texture();
	}
};

/**
 * Load texture object from JSON.
 *
 * @method loadJSON
 * @param {string} url
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
 * @param {string} url
 * @param {Function} onLoad
 */
TextureLoader.prototype.parse = function(json, onLoad)
{
	var texture = null;
	var category = json.category;

	// Video texture
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
	// Webcam texture
	else if(category === "Webcam")
	{
		texture = new WebcamTexture();

		if(json.mode !== undefined)
		{
			texture.mode = json.mode;
		}
	}
	// Compressed texture
	else if(category === "Compressed")
	{
		if(json.isCubeTexture)
		{
			texture = new CompressedTexture();
			texture.image = [];
			texture.isCubeTexture = true;

			for(var j = 0; j < json.image.length; j++)
			{
				for(var i = 0; i < json.image[j].mipmaps.length; i++)
				{
					if(json.image[j].mipmaps[i].data.toArrayBuffer !== undefined)
					{
						json.image[j].mipmaps[i].data = new Uint8Array(json.image[j].mipmaps[i].data.toArrayBuffer());
					}
				}

				texture.image.push(json.image[j]);
			}
		}
		else
		{
			for(var i = 0; i < json.mipmaps.length; i++)
			{
				if(json.mipmaps[i].data.toArrayBuffer !== undefined)
				{
					json.mipmaps[i].data = new Uint8Array(json.mipmaps[i].data.toArrayBuffer());
				}
			}

			texture = new CompressedTexture(json.mipmaps, json.width, json.height);
		}
	}
	// Cube texture
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
	// Canvas texture
	else if(category === "Canvas")
	{
		texture = new CanvasTexture(json.width, json.height);
	}
	// Texture
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

		// SpriteSheet texture
		if(category === "SpriteSheet")
		{
			texture = new SpriteSheetTexture(this.images[json.image], json.framesHorizontal, json.framesVertical, json.totalFrames);
			texture.loop = json.loop;
			texture.animationSpeed = json.animationSpeed;
			texture.beginFrame = json.beginFrame;
			texture.endFrame = json.endFrame;
		}
		// Texture
		else
		{
			texture = new Texture(this.images[json.image]);
		}
	}

	texture.needsUpdate = true;
	
	texture.uuid = json.uuid;
	texture.name = json.name;

	texture.mapping = json.mapping;

	texture.repeat.set(json.repeat[0], json.repeat[1]);
	texture.offset.set(json.offset[0], json.offset[1]);
	if(json.center !== undefined) {texture.center.set(json.center[0], json.center[1]);}
	if(json.rotation !== undefined) {texture.rotation = json.rotation;}

	texture.wrapS = json.wrap[0];
	texture.wrapT = json.wrap[1];

	if(json.format !== undefined) {texture.format = json.format;}
	if(json.type !== undefined) {texture.type = json.type;}
	if(json.encoding !== undefined) {texture.encoding = json.encoding;}

	texture.minFilter = json.minFilter;
	texture.magFilter = json.magFilter;
	texture.anisotropy = json.anisotropy;

	texture.flipY = json.flipY;
	if(json.premultiplyAlpha !== undefined) {texture.premultiplyAlpha = json.premultiplyAlpha;}
	if(json.unpackAlignment !== undefined) {texture.unpackAlignment = json.unpackAlignment;}

	if(onLoad !== undefined)
	{
		onLoad(texture);
	}

	return texture;
};
