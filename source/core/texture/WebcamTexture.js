import {Texture, LinearFilter} from "three";

/**
 * Webcam texture is used to capture and display video from a webcam in real-time.
 * 
 * It uses WebRTC, the host must support it, otherwise WebcamTexture will display a black image.
 * 
 * @class WebcamTexture
 * @extends {Texture}
 * @param {number} mapping
 * @param {number} wrapS
 * @param {number} wrapT
 * @param {number} type
 * @param {number} anisotropy
 */
class WebcamTexture extends Texture
{
	constructor(mapping, wrapS, wrapT, type, anisotropy)
	{	
		var video = document.createElement("video");
		video.autoplay = true;
		video.loop = true;

		/**
		 * Image is used to store a DOM video element
		 * 
		 * @property image
		 * @type {Element}
		 */
		super(video, mapping, wrapS, wrapT, LinearFilter, LinearFilter, undefined, type, anisotropy);
		
		var self = this;
		
		this.generateMipmaps = false;
		this.disposed = false;
		this.name = "webcam";
		this.category = "Webcam";	
		this.mode = WebcamTexture.USER;

		/**
		 * Webcam video, media stream
		 *
		 * @property stream
		 * @type {MediaStream}
		 */
		this.stream = null;

		this.connect();

		// Webcam video update loop
		function update()
		{
			if (video.readyState >= video.HAVE_CURRENT_DATA)
			{
				self.needsUpdate = true;
			}

			if (!self.disposed)
			{
				requestAnimationFrame(update);
			}
		};
		requestAnimationFrame(update);
	}

	/**
	 * Connect to camera.
	 *
	 * @method connect
	 */
	connect()
	{
		var constrains = {facingMode: this.mode === WebcamTexture.USER ? "user" : {exact: "environment"}};

		var self = this;
		
		if (navigator.webkitGetUserMedia !== undefined)
		{
			navigator.getUserMedia = navigator.webkitGetUserMedia;
		}
		
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
		{
			navigator.mediaDevices.getUserMedia({video: constrains}).then(function(stream)
			{
				self.stream = stream;
				self.image.srcObject = stream;
				self.image.play();
			})
				.catch(function(error)
				{
					console.warn("nunuStudio: No webcam available");
				});				
		}
		else if (navigator.getUserMedia)
		{
			navigator.getUserMedia({video: true}, function(stream)
			{
				self.stream = stream;
				self.image.src = URL.createObjectURL(stream);
			},
			function(error)
			{
				console.warn("nunuStudio: No webcam available");
			});		
		}
	}

	/**
	 * Disconnect from camera.
	 *
	 * @method disconnect
	 */
	disconnect()
	{
		if (this.stream !== null)
		{
			var tracks = this.stream.getTracks();
			for (var i = 0; i < tracks.length; i++)
			{
				tracks[i].stop();
			}
		}
	}

	/**
	 * Dispose webcam texture.
	 * 
	 * @method dispose
	 */
	dispose()
	{	
		super.dispose();

		this.disconnect();
		this.disposed = true;

		if (!this.image.paused)
		{
			this.image.pause();
		}
	}

	/**
	 * Serialize webcam texture to JSON.
	 *
	 * @method toJSON
	 * @param {Object} meta Metadata.
	 */
	toJSON(meta)
	{
		var data = super.toJSON(meta);

		data.mode = this.mode;

		return data;
	}
}

/**
 * Prefer the front facing camera.
 * 
 * @static
 * @attribute USER
 * @type {number}
 */
WebcamTexture.USER = 21;

/**
 * Prefer the back camera.
 * 
 * @static
 * @attribute ENVIRONMENT
 * @type {number}
 */
WebcamTexture.ENVIRONMENT = 22;

WebcamTexture.isTexture = true;

export {WebcamTexture};
