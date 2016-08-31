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

	//Call super constructor
	THREE.VideoTexture.call(this, document.createElement("video"), mapping, wrapS, wrapT, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFormat, type, anisotropy);

	//Name
	this.name = "video";
	this.category = "Video";

	//Controls
	this.autoplay = true;
	this.loop = true;

	//Video
	this.image.autoplay = this.autoplay;
	this.image.loop = this.loop;
	this.image.src = this.video.data;
}

//Super prototypes
VideoTexture.prototype = Object.create(THREE.VideoTexture.prototype);

//Dispose texture
VideoTexture.prototype.dispose = function()
{
	if(!this.image.paused)
	{
		this.image.pause();
	}
	THREE.VideoTexture.prototype.dispose.call(this);
}

//Create JSON description
VideoTexture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);
	var video = this.video.toJSON(meta);

	data.video = video.uuid;
	data.loop = this.loop;
	data.autoplay = this.autoplay;

	return data;
}