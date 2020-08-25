import {Component} from "../../../components/Component.js";
import {AnimationKeyframe} from "./AnimationKeyframe.js";

function AnimationTrack(parent, editor, track)
{
	Component.call(this, parent, "div");

	this.editor = editor;
	this.track = track;

	this.createKeyframes();
}

AnimationTrack.prototype = Object.create(Component.prototype);

AnimationTrack.prototype.updateKeyframes = function()
{
	this.removeAllChildren();
	this.createKeyframes();
};

AnimationTrack.prototype.createKeyframes = function()
{
	var times = this.track.times;

	for (var k = 0; k < times.length; k++)
	{
		var key = new AnimationKeyframe(this, this.editor, this, this.track, k);
		key.size.set(5, 30);
		key.position.set(this.editor.zoom * times[k], 0);
		key.updateInterface();
	}
};

export {AnimationTrack};
