function VideoTexture(url)
{
	//Create video element
	this.video = document.createElement("video");
	this.video.width = 256;
	this.video.height = 256;
	this.video.autoplay = true;
	this.video.loop = true;
	this.video.src = url;

	//Source URL
	this.url = url;

	//Create Texture part of object
	THREE.Texture.call(this, this.video);
	
	//Dont generate mipmaps
	this.generateMipmaps = false;
}

//Function prototypes
VideoTexture.prototype = Object.create(THREE.Texture.prototype);
VideoTexture.prototype.update = update;
VideoTexture.prototype.dispose = dispose;

//Update texture state
function update()
{
	if(this.video.readyState >= this.video.HAVE_CURRENT_DATA)
	{
		this.needsUpdate = true;
	}	
}

//Dispose texture
function dispose()
{
	this.video.pause();
	THREE.Texture.prototype.dispose.call(this);
}
