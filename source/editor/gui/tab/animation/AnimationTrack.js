"use strict";

function AnimationTrack(parent, editor, track)
{
	Element.call(this, parent, "div");

	this.element.style.overflow = "visible";
	
	this.editor = editor;
	this.track = track;

	this.createKeyframes();
}

AnimationTrack.prototype = Object.create(Element.prototype);

AnimationTrack.prototype.updateKeyframes = function()
{
	this.clearKeyframes();
	this.createKeyframes();
};

AnimationTrack.prototype.createKeyframes = function()
{
	var times = this.track.times;

	for(var k = 0; k < times.length; k++)
	{
		var key = new AnimationKeyframe(this.element, this.editor, this, this.track, k);
		key.size.set(5, 30);
		key.position.set(this.editor.zoom * times[k], 0);
		key.updateInterface();
	}
};

AnimationTrack.prototype.clearKeyframes = function()
{
	while(this.element.firstChild)
	{
		this.element.removeChild(this.element.firstChild);
	}
};
