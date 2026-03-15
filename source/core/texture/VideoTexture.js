import {Texture, LinearFilter, RGBFormat} from "three";
import {Video} from "../resources/Video.js";

/**
 * Video texture, uses a video DOM element instead of a img element.
 * 
 * VideoTexture also provides methods for playback control.
 * 
 * @class VideoTexture
 * @extends {Texture}
 * @module Textures
 * @param {Video} video
 * @param {number} mapping
 * @param {number} wrapS
 * @param {number} wrapT
 * @param {number} type
 * @param {number} anisotropy
 */
class VideoTexture extends Texture
{
	constructor(video, mapping, wrapS, wrapT, type, anisotropy)
	{
		super(document.createElement("video"), mapping, wrapS, wrapT, LinearFilter, LinearFilter, RGBFormat, type, anisotropy);

		this.disposed = false;
		this.generateMipmaps = false;

		this.name = "video";
		this.category = "Video";

		/**
		 * If true the video starts playing automatically.
		 *
		 * @property autoplay
		 * @default true
		 * @type {boolean}
		 */
		this.autoplay = true;

		/**
		 * If true the video plays in loop.
		 *
		 * @property loop
		 * @default true
		 * @type {boolean}
		 */
		this.loop = true;

		/**
		 * Start time in seconds.
		 *
		 * @property playbackRate
		 * @default 1.0
		 * @type {number}
		 */
		this.playbackRate = 1.0;

		/**
		 * Video audio volume, its a values between 1.0 and 0.0.
		 *
		 * @property volume
		 * @default 1.0
		 * @type {number}
		 */
		this.volume = 1.0;

		/**
		 * Image is used to store a DOM video element.
		 *
		 * @property image
		 * @type {Element}
		 */
		this.image.crossOrigin = "anonymous";
		this.image.autoplay = this.autoplay;
		this.image.playbackRate = this.playbackRate;
		this.image.loop = this.loop;
		this.image.volume = this.volume;

		/**
		 * Video source resource.
		 *
		 * @property video
		 * @type {Video}
		 */
		this.video = null;
		this.setVideo(video);

		// Video update loop
		var self = this;
		function update()
		{
			if (!self.disposed)
			{
				if (self.image.readyState >= self.image.HAVE_CURRENT_DATA)
				{
					self.needsUpdate = true;
				}

				requestAnimationFrame(update);
			}
		};
		update();
	}

	/**
	 * Set the video source to be used.
	 *
	 * Can be a Video, VideoStream or a URL String.
	 * 
	 * @param {Video | VideoStream | string} video
	 * @method setVideo
	 */
	setVideo(video)
	{
		if (video === null || video === undefined)
		{
			this.video = null;
			this.image.src = null;
			return;
		}

		this.video = typeof video === "string" ? new Video(video) : video;
		this.image.src = this.video.data;
	}

	/**
	 * Set video time in seconds.
	 * 
	 * @param {number} time
	 * @method setTime
	 */
	setTime(time)
	{
		this.image.currentTime = time;
	}

	/**
	 * Set loop mode.
	 * 
	 * @param {boolean} loop
	 * @method setLoop
	 */
	setLoop(loop)
	{
		this.loop = loop;
		this.image.loop = loop;
	}

	/**
	 * Set video volume.
	 * 
	 * @param {number} volume
	 * @method setVolume
	 */
	setVolume(volume)
	{
		this.volume = volume >= 0 && volume <= 1 ? volume : volume >= 0 ? 1.0 : 0.0;
		this.image.volume = this.volume;
	}

	/**
	 * Set autoplay value.
	 *
	 * If the image is already playing it will not stop playing.
	 *
	 * @method setAutoPlay
	 * @param {boolean} value If true the video will play automatically.
	 */
	setAutoPlay(value)
	{
		this.autoplay = value;
		this.image.autoplay = this.autoplay;
	}

	/**
	 * Set video playback speed.
	 * 
	 * @method setPlaybackRate
	 * @param {number} playbackRate
	 */
	setPlaybackRate(playbackRate)
	{
		this.playbackRate = playbackRate;
		this.image.playbackRate = playbackRate;
	}

	/**
	 * Pause video playback.
	 * 
	 * @method pause
	 */
	pause()
	{
		if (!this.image.paused)
		{
			this.image.pause();
		}
	}

	/**
	 * Start playing video.
	 * 
	 * @method play
	 */
	play()
	{
		if (this.image.paused)
		{
			this.image.play();
		}
	}

	/**
	 * Dispose video texture.
	 *
	 * Stops the video and cleans the DOM video element inside the VideoTexture.
	 * 
	 * @method dispose
	 */
	dispose()
	{
		super.dispose();

		this.disposed = true;
		
		this.image.pause();
		this.image.src = "";
		this.image.load();
	}

	/**
	 * Create Video texture json description.
	 *
	 * @method toJSON
	 * @param {Object} meta
	 * @return {Object} json
	 */
	toJSON(meta)
	{
		var data = super.toJSON(meta);
		var video = this.video.toJSON(meta);

		data.video = video.uuid;
		data.loop = this.loop;
		data.autoplay = this.autoplay;
		data.playbackRate = this.playbackRate;
		data.volume = this.volume;

		return data;
	}
}

VideoTexture.isVideoTexture = true;

export {VideoTexture};
