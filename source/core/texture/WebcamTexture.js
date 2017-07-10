"use strict";

/**
 * Webcam texture is used to capture and display video from a webcam in real-time.
 * 
 * It uses WebRTC, the host must support it, otherwise WebcamTexture will display a black image.
 * 
 * @class WebcamTexture
 * @constructor
 * @extends {Texture}
 * @param {Number} mapping
 * @param {Number} wrapS
 * @param {Number} wrapT
 * @param {Number} type
 * @param {Number} anisotropy
 */

/**
 * Image is used to store a DOM video element
 * 
 * @property image
 * @type {DOM}
 */
function WebcamTexture(mapping, wrapS, wrapT, type, anisotropy)
{	
	var video = document.createElement("video");
	video.autoplay = true;
	video.loop = true;

	THREE.Texture.call(this, video, mapping, wrapS, wrapT, THREE.LinearFilter, THREE.LinearFilter, THREE.RGBFormat, type, anisotropy);

	//Disable mipmaps generation
	this.generateMipmaps = false;
	this.disposed = false;

	//Attributes
	this.name = "webcam";
	this.category = "Webcam";	
	this.mode = WebcamTexture.USER;

	//Media stream
	this.stream = null;

	//Connect to camera
	this.connect();

	//Webcam video update loop
	var self = this;
	function update()
	{
		if(video.readyState >= video.HAVE_CURRENT_DATA)
		{
			self.needsUpdate = true;
		}

		if(!self.disposed)
		{
			requestAnimationFrame(update);
		}
	};
	requestAnimationFrame(update);
};

WebcamTexture.USER = 21;
WebcamTexture.ENVIRONMENT = 22;

WebcamTexture.prototype = Object.create(THREE.Texture.prototype);

/**
 * Connect to camera.
 *
 * @method connect
 */
WebcamTexture.prototype.connect = function()
{
	var constrains = (this.mode === WebcamTexture.USER) ? {facingMode: "user"} : {facingMode: {exact: "environment"}};
	var self = this;

	//Chorme
	if(navigator.webkitGetUserMedia)
	{
		navigator.webkitGetUserMedia({video:constrains}, function(stream)
		{
			self.stream = stream;
			self.image.src = URL.createObjectURL(stream);
		},
		function(error)
		{
			console.warn("nunuStudio: No webcam available");
		});		
	}
	//Firefox
	else if(navigator.mediaDevices.getUserMedia)
	{
		navigator.mediaDevices.getUserMedia({video:constrains}).then(function(stream)
		{
			self.stream = stream;
			self.image.src = URL.createObjectURL(stream);
		})
		.catch(function(error)
		{
			console.warn("nunuStudio: No webcam available");
		});				
	}
};

/**
 * Disconnect from camera.
 *
 * @method disconnect
 */
WebcamTexture.prototype.disconnect = function()
{
	var tracks = this.stream.getTracks();
	for(var i = 0; i < tracks.length; i++)
	{
		tracks[i].stop();
	}
};

/**
 * Dispose webcam texture.
 * 
 * @method dispose
 */
WebcamTexture.prototype.dispose = function()
{	
	THREE.Texture.prototype.dispose.call(this);

	this.disconnect();
	this.disposed = true;

	if(!this.image.paused)
	{
		this.image.pause();
	}
};

/**
 * Serialize webcam texture to JSON.
 *
 * @method toJSON
 * @param {Object} meta Metadata.
 */
WebcamTexture.prototype.toJSON = function(meta)
{
	var data = THREE.Texture.prototype.toJSON.call(this, meta);

	data.mode = this.mode;

	return data;
};
