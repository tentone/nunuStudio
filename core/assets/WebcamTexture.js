function WebcamTexture()
{
	//Check if webcam available
	if(navigator.webkitGetUserMedia || navigator.mozGetUserMedia ? true : false)
	{
		console.warn("Webcam available");
	}

	//Create the video element
	this.video = document.createElement("video");
	this.video.width = 320;
	this.video.height = 240;
	this.video.autoplay	= true;
	this.video.loop	= true;

	if(navigator.webkitGetUserMedia)
	{
		navigator.webkitGetUserMedia({video:true}, function(stream)
		{
			video.src = URL.createObjectURL(stream);
		},
		function(error)
		{
			console.warn("No webcam available");
		});		
	}
	else if(navigator.mozGetUserMedia)
	{
		navigator.mozGetUserMedia({video:true}, function(stream)
		{
			video.src = URL.createObjectURL(stream);
		},
		function(error)
		{
			console.warn("No webcam available");
		});				
	}

	//Create Texture part of object
	THREE.Texture.call(this, video);
}

//Function prototypes
WebcamTexture.prototype = Object.create(THREE.Texture.prototype);
WebcamTexture.prototype.update = update;
WebcamTexture.prototype.dispose = dispose;

//Update texture
function update(delta, now)
{
	if(this.video.readyState !== this.video.HAVE_ENOUGH_DATA)	
	{
		return;
	}
	this.texture.needsUpdate	= true;		
}

//Dispose texture
function dipose()
{
	THREE.Texture.prototype.toJSON.call(this);
	this.video.pause()
}