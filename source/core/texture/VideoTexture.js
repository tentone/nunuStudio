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

	this.generateMipmaps = false;
	this.disposed = false;

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

	return data;
}