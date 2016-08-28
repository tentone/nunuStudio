"use strict";

//Webcam texture constructor
function WebcamTexture(mapping, wrapS, wrapT, magFilter, minFilter, type, anisotropy)
{
	//Check if webcam API available
	if(navigator.webkitGetUserMedia || navigator.mediaDevices.getUserMedia)
	{
		console.warn("Webcam available");
	}

	//Create the video element
	var video = document.createElement("video");
	video.width = 512;
	video.height = 512;
	video.autoplay = true;
	video.loop = true;

	//Create webcam stream
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
	else if(navigator.mediaDevices.getUserMedia)
	{
		navigator.mediaDevices.getUserMedia({video:true}, function(stream)
		{
			video.src = URL.createObjectURL(stream);
		},
		function(error)
		{
			console.warn("No webcam available");
		});				
	}

	//Call super constructor
	THREE.VideoTexture.call(this, video, mapping, wrapS, wrapT, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFormat, type, anisotropy);

	//Name
	this.name = "webcam";
	this.category = "Webcam";
}

//Super prototypes
WebcamTexture.prototype = Object.create(THREE.VideoTexture.prototype);
