"use strict";

//Video texture constructor
function VideoTexture(video, mapping, wrapS, wrapT, type, anisotropy)
{
	if(typeof video === "string")
	{
		this.video = new Video(video);
	}
	else if(video instanceof Video)
	{
		this.video = video;
	}

	//Super constructor
	THREE.Texture.call(this, document.createElement("video"), mapping, wrapS, wrapT, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFormat, type, anisotropy);

	//Texture control
	this.generateMipmaps = false;
	this.disposed = false;

	//Name
	this.name = "video";
	this.category = "Video";

	//Controls
	this.autoplay = true;
	this.loop = true;
	this.speed = 1.0;
	this.volume = 1.0;

	//Video
	this.image.playbackRate = this.speed;
	this.image.autoplay = this.autoplay;
	this.image.loop = this.loop;
	this.image.volume = this.volume;
	this.image.src = this.video.data;

	console.log(this.image.prototype);

	//Video update loop
	var texture = this;
	var video = this.image;
	function update()
	{
		if(video.readyState >= video.HAVE_CURRENT_DATA)
		{
			texture.needsUpdate = true;
		}

		if(!texture.disposed)
		{
			requestAnimationFrame(update);
		}
	};
	update();
}

//Super prototypes
VideoTexture.prototype = Object.create(THREE.Texture.prototype);

//Set video time in seconds
VideoTexture.prototype.setTime = function(time)
{
	this.image.currentTime = time;
}

//Set loop mode
VideoTexture.prototype.setLoop = function(loop)
{
	this.loop = loop;
	this.image.loop = loop;
}

//Set video volume
VideoTexture.prototype.setVolume = function(volume)
{
	this.volume = (volume >= 0 && volume <= 1) ? volume : (volume >= 0) ? 1.0 : 0.0;
	this.image.volume = this.volume;
}

//Set video time in seconds
VideoTexture.prototype.setPlaybackRate = function(speed)
{
	this.speed = speed;
	this.image.playbackRate = speed;
}

//Stop video
VideoTexture.prototype.pause = function()
{
	if(!this.image.paused)
	{
		this.image.pause();
	}
}

//Play video
VideoTexture.prototype.play = function()
{
	if(this.image.paused)
	{
		this.image.play();
	}
}

//Dispose texture
VideoTexture.prototype.dispose = function()
{	
	THREE.Texture.prototype.dispose.call(this);

	this.disposed = true;
	if(!this.image.paused)
	{
		this.image.pause();
	}
}

//Create JSON description
VideoTexture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);
	var video = this.video.toJSON(meta);

	data.video = video.uuid;
	data.loop = this.loop;
	data.autoplay = this.autoplay;
	data.speed = this.speed;
	data.volume = this.volume;

	return data;
}