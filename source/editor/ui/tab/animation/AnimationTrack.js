"use strict";

function AnimationTrack(parent, editor, track)
{
	Element.call(this, parent);

	this.editor = editor;
	this.track = track;
}

AnimationTrack.prototype = Object.create(Element.prototype);

AnimationTrack.prototype.createKeyframes = function()
{
	for(var k = 0; k < times.length; k++)
	{
		var key = new AnimationKeyframe(track.element, this.editor, this.track, k);
		key.size.set(5, this.editor.timelineHeight);
		key.position.set(this.editor.zoom * times[k], 0);
		key.updateInterface();
	}
};

AnimationTrack.prototype.clearKeyframes = function()
{
	while(this.element.firstChild)
	{
		this.element.removeChild(this.info.firstChild);
	}
};

AnimationTrack.prototype.updateKeyframes = function()
{
	this.clearKeyframes();
	this.createKeyframes();
};