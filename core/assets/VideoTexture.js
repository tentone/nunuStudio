function VideoTexture(url)
{
	//Create video element
	this.video = document.createElement("video");
	this.video.width = 320;
	this.video.height = 240;
	this.video.autoplay = true;
	this.video.loop = true;
	this.video.src = url;

	//Create Texture part of object
	THREE.Texture.call(this, this.video);
}

//Function prototypes
VideoTexture.prototype = Object.create(THREE.Texture.prototype);
VideoTexture.prototype.update = update;
VideoTexture.prototype.dispose = dispose;

//Update texture state
function update()
{
	if(this.video.readyState !== this.video.HAVE_ENOUGH_DATA)
	{
		return;	
	}
	this.texture.needsUpdate = true;		
}

//Dispose texture
function dipose()
{
	THREE.Texture.prototype.toJSON.call(this);
	this.video.pause()
}