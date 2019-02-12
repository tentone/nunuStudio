"use strict";

/**
 * Media element can be used to play media content.
 *
 * Should be used as a base for other multimedia elements like audio and video.
 *
 * @class Media
 * @extends {Element}
 * @param {Element} parent Parent element.
 */
function Media(parent, type)
{
	Element.call(this, parent, "div");

	//Media
	this.media = document.createElement(type);
	this.element.appendChild(this.media);
}

Media.prototype = Object.create(Element.prototype);

Media.prototype.constructor = Media;

/**
 * Set element Media volume.
 * 
 * @method setVolume
 * @param {Number} volume Volume level from 0 to 1.
 */
Media.prototype.setVolume = function(volume)
{
	this.media.volume = volume;	
};

/**
 * Set video to be played.
 *
 * @method setValue
 * @param {Video} value Video resource to play.
 */
Media.prototype.setValue = function(video)
{
	this.media.src = video.data;
};

/**
 * Set URL of the media to play.
 *
 * @method setURL
 * @param {String} value Media url.
 */
Media.prototype.setURL = function(value)
{
	this.media.src = value;
};

/**
 * Set the playback time.
 *
 * @method setTime
 * @param {Number} time Time to be set.
 */
Media.prototype.setTime = function(time)
{
	this.media.currentTime = time;
};

/**
 * Set autoplay mode.
 * 
 * @method setAutoplay
 * @param {Boolean} value If true the media starts playing automatically.
 */
Media.prototype.setAutoplay = function(value)
{
	this.media.autoplay = value;
};

/**
 * Check if the media is playing.
 * 
 * @method isPlaying
 * @return {Boolean} True if the media is playing.
 */
Media.prototype.isPlaying = function(value)
{
	return !this.media.paused;
};

/**
 * Set loop mode.
 * 
 * @method setLoop
 * @param {Boolean} value If true the media plays in loop.
 */
Media.prototype.setLoop = function(value)
{
	this.media.loop = value;
};

/**
 * Set playback rate.
 * 
 * @method setPlaybackRate
 * @param {Number} setPlaybackRate The velocity of playback.
 */
Media.prototype.setPlaybackRate = function(playbackRate)
{
	this.media.playbackRate = playbackRate;
};

/**
 * Play media playback.
 * 
 * @method play
 */
Media.prototype.play = function()
{
	this.media.play();
};

/**
 * Stop media playback.
 * 
 * @method stop
 */
Media.prototype.stop = function()
{
	this.media.currentTime = 0;
	this.media.pause();
};

/**
 * Pause media.
 * 
 * @method pause
 */
Media.prototype.pause = function()
{
	this.media.pause();
};

Media.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.media.style.width = this.size.x + "px";
	this.media.style.height = this.size.y + "px";
};
