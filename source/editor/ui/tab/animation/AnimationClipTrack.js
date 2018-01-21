"use strict";

function AnimationClipTrack(parent, editor, animation)
{
	this.editor = editor;
	this.animation = animation;

	var tracks = animation.tracks;
	var width = this.editor.zoom * animation.duration + 1;
	var height = 30 * tracks.length + 1;
	var self = this;

	var button = new AnimationButton(this.editor.info, this, animation);
	button.position.set(0, this.editor.timebarHeight);
	button.size.set(0, 30);
	button.updateInterface();

	var block = new AnimationOptions(parent, this, animation);
	block.position.set(0, this.editor.timebarHeight);
	block.size.set(width, 30);
	block.updateInterface();

	this.editor.timebarHeight += 30;

	this.timegrid = document.createElement("canvas");
	this.timegrid.style.position = "absolute";
	this.timegrid.style.top = this.editor.timebarHeight + "px";
	this.timegrid.style.left = "0px";
	this.timegrid.style.width = width + "px";
	this.timegrid.style.height = height + "px";
	this.timegrid.width = width;
	this.timegrid.height = height;
	parent.appendChild(this.timegrid);

	var context = this.timegrid.getContext("2d");
	context.fillStyle = Editor.theme.barColor;

	//Horizontal lines
	for(var l = 0; l <= height; l += 30)
	{
		context.fillRect(0, l, width, 1);
	}

	//Vertical lines
	for(var l = 0, step = this.editor.zoom / 10; l <= width; l += step)
	{
		context.fillRect(l, 0, 1, height);
	}

	var mouse = 0, initial = 0;

	//Seekbar
	this.seek = document.createElement("div");
	this.seek.style.position = "absolute";
	this.seek.style.backgroundColor = "#FFFFFF";
	this.seek.style.zIndex = "100";
	this.seek.style.top = this.editor.timebarHeight + "px";
	this.seek.style.left = "0px";
	this.seek.style.width = "4px";
	this.seek.style.height = height + "px";
	this.seek.style.overflow = "hidden";
	this.seek.style.cursor = "e-resize";
	this.seek.onmousedown = function(event)
	{
		initial = self.editor.mixer._actions[0].time;
		mouse = event.clientX;
		self.manager.create();
	};
	parent.appendChild(this.seek);

	//Seekbar manager
	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		var time = initial + (event.clientX - mouse) / self.zoom;
		self.editor.mixer.setTime(time > 0 ? time : 0);
		Interface.panel.updatePanel();
	});
	this.manager.add(window, "mouseup", function(event)
	{
		self.manager.destroy();
	});

	//Tracks
	for(var j = 0; j < tracks.length; j++)
	{
		var track = new AnimationTrack(parent, this, tracks[j]);
		track.position.set(0, this.editor.timebarHeight);
		track.size.set(this.editor.zoom * animation.duration, 30);
		track.updateInterface();
		
		var button = new AnimationTrackButton(this.editor.info, this, animation, tracks[j], track);
		button.position.set(0, this.editor.timebarHeight);
		button.size.set(0, 30);
		button.updateInterface();

		this.editor.timebarHeight += 30;
	}
}
