"use strict";

function VideoPlayer(parent)
{
	Element.call(this, parent);

	this.video = document.createElement("video");
	this.video.src = this.video.data;
	this.video.autoplay = this.autoplay;
	this.video.playbackRate = this.playbackRate;
	this.video.loop = this.loop;
	this.video.volume = this.volume;
	this.element.appendChild(this.video);
}

VideoPlayer.prototype = Object.create(Element.prototype);

VideoPlayer.prototype.setTime = function(time)
{
	this.video.currentTime = time;
}

VideoPlayer.prototype.setLoop = function(loop)
{
	this.video.loop = loop;
};

VideoPlayer.prototype.setVolume = function(volume)
{
	this.video.volume = (volume >= 0 && volume <= 1) ? volume : (volume >= 0) ? 1.0 : 0.0;
};

VideoPlayer.prototype.setAutoPlay = function(value)
{
	this.video.autoplay = value;
}

VideoPlayer.prototype.setPlaybackRate = function(playbackRate)
{
	this.video.playbackRate = playbackRate;
};
