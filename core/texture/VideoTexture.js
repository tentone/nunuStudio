"use strict";

//Video texture constructor
function VideoTexture(video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy)
{
	//Video data
	this.data = "";
	this.encoding = "";

	//If video is a URL
	if(typeof video === "string")
	{
		this.encoding = video.split(".").pop();
		this.data = "data:video/" + this.encoding + ";base64," + base64ArrayBuffer(App.readFileArrayBuffer(video));

		video = document.createElement("video");
		video.width = 256;
		video.height = 256;
		video.autoplay = true;
		video.loop = true;
		video.src = this.data;
	}

	//Call super constructor
	THREE.VideoTexture.call(this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);

	//Name
	this.name = "video";
	this.category = "Video";

	//Set filtering
	this.minFilter = THREE.LinearFilter;
	this.magFilter = THREE.LinearFilter;
	this.format = THREE.RGBFormat;
}

//Super prototypes
VideoTexture.prototype = Object.create(THREE.VideoTexture.prototype);

//Dispose texture
VideoTexture.prototype.dispose = function()
{
	if(!this.video.paused)
	{
		this.video.pause();
	}
	THREE.VideoTexture.prototype.dispose.call(this);
}

//Create JSON description
VideoTexture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);
	
	return data;
}