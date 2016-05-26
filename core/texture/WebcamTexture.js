function WebcamTexture()
{
	//Check if webcam available
	if(navigator.webkitGetUserMedia || navigator.mozGetUserMedia ? true : false)
	{
		console.warn("Webcam available");
	}

	//Create the video element
	this.video = document.createElement("video");
	this.video.width = 256;
	this.video.height = 256;
	this.video.autoplay	= true;
	this.video.loop	= true;

	if(navigator.webkitGetUserMedia)
	{
		navigator.webkitGetUserMedia({video:true}, function(stream)
		{
			this.video.src = URL.createObjectURL(stream);
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
			this.video.src = URL.createObjectURL(stream);
		},
		function(error)
		{
			console.warn("No webcam available");
		});				
	}

	//Create Texture part of object
	THREE.Texture.call(this, this.video);
}

//Function prototypes
WebcamTexture.prototype = Object.create(THREE.Texture.prototype);
WebcamTexture.prototype.update = update;
WebcamTexture.prototype.dispose = dispose;

//Update texture
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
	THREE.Texture.prototype.dipose.call(this);
}