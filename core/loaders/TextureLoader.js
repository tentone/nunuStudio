"use strict";

//Texture loader constructor
function TextureLoader(manager)
{
	this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;

	//Assets
	this.images = [];
	this.videos = [];
	this.fonts = [];
}

//Load texture from url
TextureLoader.prototype.load = function(url, onLoad, onProgress, onError)
{
	var self = this;
	var loader = new THREE.XHRLoader(this.manager);
	loader.load(url, function(text)
	{
		self.parse(JSON.parse(text), onLoad);
	}, onProgress, onError);
}

//Parse texture JSON
TextureLoader.prototype.parse = function(json)
{
	var texture = null;
	var category = json.category;

	//Video texture
	if(category === "Video")
	{
		/*var video = document.createElement("video");
		video.width = 256;
		video.height = 256;
		video.autoplay = true;
		video.loop = true;
		video.src = json.data;

		texture = new VideoTexture();
		texture.encoding = json.encoding;
		texture.data = json.data;*/
	}
	//Webcam texture
	else if(category === "Webcam")
	{
		texture = new WebcamTexture();
	}
	//Texture
	else
	{
		if(json.image === undefined)
		{
			console.warn("ObjectLoader: No image specified for", json.uuid);
		}

		if(this.images[json.image] === undefined)
		{
			console.warn("ObjectLoader: Undefined image", json.image);
		}
		texture = new Texture(this.images[json.image]);
	}

	texture.uuid = json.uuid;
	texture.name = json.name;
	texture.mapping = parseConstant(json.mapping);

	texture.offset = new THREE.Vector2(json.offset[0], json.offset[1]);
	texture.repeat = new THREE.Vector2(json.repeat[0], json.repeat[1]);
	texture.wrapS = parseConstant(json.wrap[0]);
	texture.wrapT = parseConstant(json.wrap[1]);

	texture.minFilter = parseConstant(json.minFilter);
	texture.magFilter = parseConstant(json.magFilter);

	texture.anisotropy = json.anisotropy;
	texture.flipY = json.flipY;
}

//Set images
TextureLoader.prototype.setImages = function(images)
{
	this.images = images;
	return this;
}

//Set videos
TextureLoader.prototype.setVideos = function(images)
{
	this.videos = videos;
	return this;
}

//Set fonts
TextureLoader.prototype.setFonts = function(images)
{
	this.fonts = fonts;
	return this;
}
