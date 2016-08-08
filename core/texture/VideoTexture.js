"use strict";

//Video texture constructor
function VideoTexture(url)
{
	//Create video element
	this.video = document.createElement("video");
	this.video.width = 256;
	this.video.height = 256;
	this.video.autoplay = true;
	this.video.loop = true;
	this.video.src = url;

	//Create Texture part of object
	THREE.VideoTexture.call(this, this.video);

	//Set filtering
	this.minFilter = THREE.LinearFilter;
	this.magFilter = THREE.LinearFilter;
	this.format = THREE.RGBFormat;

	//Name
	this.name = "video";
}

//Function prototypes
VideoTexture.prototype = Object.create(THREE.VideoTexture.prototype);
VideoTexture.prototype.dispose = dispose;

//Dispose texture
function dispose()
{
	if(!this.video.paused)
	{
		this.video.pause();
	}
	THREE.Texture.prototype.dispose.call(this);
}
