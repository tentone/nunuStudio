import {Video} from "../../../core/resources/Video.js";
import {Component} from "../Component.js";

/**
 * Media element can be used to play media content.
 *
 * Should be used as a base for other multimedia elements like audio and video.
 *
 * @class Media
 * @extends {Component}
 * @param {Component} parent Parent element.
 * @param {string} type Type of the media element (e.g audio, video)
 */
class Media extends Component {
	constructor(parent, type) {
	super(parent, "div");

	/**
	 * Media DOM element that compatible with media controls.
	 *
	 * @attribute media
	 * @type {Element}
	 */
	this.media = document.createElement(type);
	this.element.appendChild(this.media);
	}

/**
 * Set element Media volume.
 * 
 * @method setVolume
 * @param {number} volume Volume level from 0 to 1.
 */
	setVolume(volume) {
	this.media.volume = volume;	
	}

/**
 * Set video to be played.
 *
 * @method setValue
 * @param {Video} value Video resource to play.
 */
	setValue(video) {
	this.media.src = video.data;
	}

/**
 * Set URL of the media to play.
 *
 * @method setURL
 * @param {string} value Media url.
 */
	setURL(value) {
	this.media.src = value;
	}

/**
 * Set the playback time.
 *
 * @method setTime
 * @param {number} time Time to be set.
 */
	setTime(time) {
	this.media.currentTime = time;
	}

/**
 * Set autoplay mode.
 * 
 * @method setAutoplay
 * @param {boolean} value If true the media starts playing automatically.
 */
	setAutoplay(value) {
	this.media.autoplay = value;
	}

/**
 * Check if the media is playing.
 * 
 * @method isPlaying
 * @return {boolean} True if the media is playing.
 */
	isPlaying(value) {
	return !this.media.paused;
	}

/**
 * Set loop mode.
 * 
 * @method setLoop
 * @param {boolean} value If true the media plays in loop.
 */
	setLoop(value) {
	this.media.loop = value;
	}

/**
 * Set playback rate.
 * 
 * @method setPlaybackRate
 * @param {number} setPlaybackRate The velocity of playback.
 */
	setPlaybackRate(playbackRate) {
	this.media.playbackRate = playbackRate;
	}

/**
 * Play media playback.
 * 
 * @method play
 */
	play() {
	this.media.play();
	}

/**
 * Stop media playback.
 * 
 * @method stop
 */
	stop() {
	this.media.currentTime = 0;
	this.media.pause();
	}

/**
 * Pause media.
 * 
 * @method pause
 */
	pause() {
	this.media.pause();
	}

	updateSize() {
	super.updateSize();

	this.media.style.width = this.size.x + "px";
	this.media.style.height = this.size.y + "px";
	}

}

export {Media};
