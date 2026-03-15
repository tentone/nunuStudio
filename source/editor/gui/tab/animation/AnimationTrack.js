import {Component} from "../../../components/Component.js";
import {AnimationKeyframe} from "./AnimationKeyframe.js";

class AnimationTrack extends Component {
	constructor(parent, editor, track) {
	super(parent, "div");

	this.editor = editor;
	this.track = track;

	this.createKeyframes();
	}

	updateKeyframes() {
	this.removeAllChildren();
	this.createKeyframes();
	}

	createKeyframes() {
	var times = this.track.times;

	for (var k = 0; k < times.length; k++)
	{
		var key = new AnimationKeyframe(this, this.editor, this, this.track, k);
		key.size.set(5, 30);
		key.position.set(this.editor.zoom * times[k], 0);
		key.updateInterface();
	}
	}

}

export {AnimationTrack};
