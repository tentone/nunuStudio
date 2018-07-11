"use strict";

function VideoPlayer(parent)
{
	Element.call(this, parent);

	this.video = document.createElement("video");
	this.video.autoplay = true;
	this.video.playbackRate = 1.0;
	this.video.loop = true;
	this.video.volume = 0.0;
	this.element.appendChild(this.video);
}

VideoPlayer.prototype = Object.create(Element.prototype);

VideoPlayer.prototype.setValue = function(video)
{
	this.video.src = video.data;
};

VideoPlayer.prototype.setTime = function(time)
{
	this.video.currentTime = time;
};

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

VideoPlayer.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	this.video.style.width = this.size.x + "px";
	this.video.style.height = this.size.y + "px";
};