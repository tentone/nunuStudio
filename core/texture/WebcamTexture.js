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
	this.video.width = 256;
	this.video.height = 256;
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

	THREE.VideoTexture.call(this, this.video);

	//Name
	this.name = "webcam";
	this.category = "Webcam";

	//Set filtering
	this.minFilter = THREE.LinearFilter;
	this.magFilter = THREE.LinearFilter;
	this.format = THREE.RGBFormat;
}

//Super prototypes
WebcamTexture.prototype = Object.create(THREE.VideoTexture.prototype);

//Create JSON description
WebcamTexture.prototype.toJSON = function(meta)
{
	if(meta.textures[this.uuid] !== undefined)
	{
		return meta.textures[this.uuid];
	}

	var output =
	{
		metadata:
		{
			version: Editor.VERSION,
			type: "WebcamTexture"
		},

		uuid: this.uuid,
		name: this.name,
		category: this.category,
		
		mapping: this.mapping,

		repeat: [this.repeat.x, this.repeat.y],
		offset: [this.offset.x, this.offset.y],
		wrap: [this.wrapS, this.wrapT],

		minFilter: this.minFilter,
		magFilter: this.magFilter,
		anisotropy: this.anisotropy,

		flipY: this.flipY
	};

	meta.textures[this.uuid] = output;
	return output;
}