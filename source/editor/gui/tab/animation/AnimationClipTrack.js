"use strict";

/**
 * Animation clip track contains all the elements of an animation track.
 *
 * Creates the animation clip button and option bar and all the tracks buttons and timegrids.
 *
 * @class AnimationClipTrack
 */
function AnimationClipTrack(editor, animation)
{
	this.editor = editor;
	this.animation = animation;

	var tracks = animation.tracks;

	var width = this.editor.zoom * animation.duration;
	var height = 30 * tracks.length;

	var self = this;

	/**
	 * Button of the animation clip.
	 *
	 * @attribute button
	 * @type {AnimationClipButton}
	 */
	this.button = new AnimationClipButton(this.editor.info, this.editor, animation);

	/**
	 * Options of this animation clip track.
	 *
	 * @attribute options
	 * @type {AnimationClipMenuBar}
	 */
	this.options = new AnimationClipMenuBar(this.editor.tracks, this.editor, animation);

	this.timeline = document.createElement("div");
	this.timeline.style.overflowX = "auto";
	this.timeline.style.overflowY = "hidden";
	this.timeline.style.position = "relative";
	this.timeline.style.width = "100%";
	this.timeline.style.height = (height + 1) + "px";
	this.editor.tracks.element.appendChild(this.timeline);

	/**
	 * Timeline grid canvas where the timeline is drawn into.
	 *
	 * @attribute timegrid
	 * @type {Component}
	 */
	this.timegrid = document.createElement("canvas");
	this.timegrid.width = width + 1;
	this.timegrid.height = height + 1;
	this.timeline.appendChild(this.timegrid);

	var context = this.timegrid.getContext("2d");
	context.fillStyle = "var(--bar-color)";
	for(var l = 0; l <= height; l += 30)
	{
		context.fillRect(0, l, width, 1);
	}
	for(var l = 0, step = this.editor.zoom / 10; l <= width; l += step)
	{
		context.fillRect(l, 0, 1, height);
	}

	var mouse = 0, initial = 0;

	// Seekbar
	this.seek = document.createElement("div");
	this.seek.style.position = "absolute";
	this.seek.style.backgroundColor = "#FFFFFF";
	this.seek.style.zIndex = "100";
	this.seek.style.top = "0px";
	this.seek.style.left = "0px";
	this.seek.style.width = "4px";
	this.seek.style.height = "100%";
	this.seek.style.overflow = "hidden";
	this.seek.style.cursor = "e-resize";
	this.seek.onmousedown = function(event)
	{
		initial = self.editor.mixer._actions[0].time;
		mouse = event.clientX;

		self.manager.create();
	};
	this.timeline.appendChild(this.seek);

	// Seekbar manager
	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		var time = initial + (event.clientX - mouse) / self.editor.zoom;

		if(time < 0)
		{
			time = 0;
		}
		else if(time > self.animation.duration)
		{
			time = self.animation.duration;
		}

		self.editor.mixer.setTime(time > 0 ? time : 0);

		Editor.gui.inspector.updateValues();
	});
	this.manager.add(window, "mouseup", function(event)
	{
		self.manager.destroy();
	});

	// Tracks
	for(var j = 0; j < tracks.length; j++)
	{
		var track = new AnimationTrack(this.timeline, this.editor, tracks[j]);
		track.position.set(0, j * 30);
		track.size.set(width, 30);
		track.updateInterface();
		
		var button = new AnimationTrackButton(this.editor.info, this.editor, animation, tracks[j], track);
		button.position.set(0, j * 30);
		button.size.set(0, 30);
		button.updateInterface();
	}
}
