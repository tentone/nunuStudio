function VideoTexture(url)
{
	//Create video element
	this.video = document.createElement("video");
	this.video.width = 320;
	this.video.height = 240;
	this.video.autoplay = true;
	this.video.loop = true;
	this.video.src = url;

	//Create the texture
	this.texture = new THREE.Texture(video);
}

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
	this.video.pause()
}