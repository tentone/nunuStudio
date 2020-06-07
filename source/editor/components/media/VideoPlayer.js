"use strict";

/**
 * Video player element, based on the video tag.
 *
 * @class VideoPlayer
 * @extends {Component}
 * @param {Component} parent Parent element.
 */
function VideoPlayer(parent)
{
	Media.call(this, parent, "video");

	this.media.playbackRate = 1.0;
	this.media.loop = true;
	this.media.volume = 0.0;
	this.media.autoplay = true;
}

VideoPlayer.prototype = Object.create(Media.prototype);
