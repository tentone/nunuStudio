"use strict";

/**
 * Webcam texture is used to capture and display video from a webcam in real-time
 * It uses WebRTC, the host must support it, otherwise WebcamTexture will display a black image
 * 
 * @class WebcamTexture
 * @constructor
 * @extends {THREE.Texture}
 * @param {Number} mapping
 * @param {Number} wrapS
 * @param {Number} wrapT
 * @param {Number} type
 * @param {Number} anisotropy
 */
function WebcamTexture(mapping, wrapS, wrapT, type, anisotropy)
{
	var video = document.createElement("video");
	video.autoplay = true;
	video.loop = true;

	//Chorme
	if(navigator.webkitGetUserMedia)
	{
		navigator.webkitGetUserMedia({video:true}, function(stream)
		{
			video.src = URL.createObjectURL(stream);
		},
		function(error)
		{
			console.warn("nunuStudio: No webcam available");
		});		
	}
	//Firefox
	else if(navigator.mediaDevices.getUserMedia)
	{
		navigator.mediaDevices.getUserMedia({video:true}).then(function(stream)
		{
			video.src = URL.createObjectURL(stream);
		})
		.catch(function(error)
		{
			console.warn("nunuStudio: No webcam available");
		});				
	}

	//Super constructor
	THREE.Texture.call(this, video, mapping, wrapS, wrapT, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFormat, type, anisotropy);

	this.generateMipmaps = false;
	this.disposed = false;

	//Name
	this.name = "webcam";
	this.category = "Webcam";

	//Webcam video update loop
	var texture = this;
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

WebcamTexture.prototype = Object.create(THREE.Texture.prototype);

/**
 * Dispose webcam texture
 * @method dispose
 */
WebcamTexture.prototype.dispose = function()
{	
	THREE.Texture.prototype.dispose.call(this);

	this.disposed = true;
	if(!this.image.paused)
	{
		this.image.pause();
	}
}
