"use strict";

//Webcam texture constructor
function WebcamTexture()
{
	//Check if webcam available
	if(navigator.webkitGetUserMedia || navigator.mediaDevices.getUserMedia)
	{
		console.warn("Webcam available");
	}

	//Create the video element
	this.video = document.createElement("video");
	this.video.width = 512;
	this.video.height = 512;
	this.video.autoplay	= true;
	this.video.loop	= true;

	//Self pointer
	var self = this;

	if(navigator.webkitGetUserMedia)
	{
		navigator.webkitGetUserMedia({video:true}, function(stream)
		{
			self.video.src = URL.createObjectURL(stream);
		},
		function(error)
		{
			console.warn("No webcam available");
		});		
	}
	else if(navigator.mediaDevices.getUserMedia)
	{
		navigator.mediaDevices.getUserMedia({video:true}, function(stream)
		{
			self.video.src = URL.createObjectURL(stream);
		},
		function(error)
		{
			console.warn("No webcam available");
		});				
	}

	//Create Texture part of object
	THREE.VideoTexture.call(this, this.video);

	//Set filtering
	this.minFilter = THREE.LinearFilter;
	this.magFilter = THREE.LinearFilter;
	this.format = THREE.RGBFormat;

	//Name
	this.name = "webcam";
}

//Function prototypes
WebcamTexture.prototype = Object.create(THREE.VideoTexture.prototype);
