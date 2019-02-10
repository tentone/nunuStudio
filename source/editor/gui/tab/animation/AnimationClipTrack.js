"use strict";

function AnimationClipTrack(editor, animation)
{
	this.editor = editor;
	this.animation = animation;

	var tracks = animation.tracks;
	var width = this.editor.zoom * animation.duration + 1;
	var height = 30 * tracks.length + 1;
	var self = this;

	this.button = new AnimationButton(this.editor.info, this.editor, animation);
	this.button.position.set(0, this.editor.timebarHeight);
	this.button.size.set(0, 30);
	this.button.updateInterface();

	this.options = new AnimationOptions(this.editor.tracks, this.editor, animation);
	this.options.position.set(0, this.editor.timebarHeight);
	this.options.size.set(width, 30);
	this.options.updateInterface();

	this.editor.timebarHeight += 30;

	//Canvas
	this.timegrid = document.createElement("canvas");
	this.timegrid.style.position = "absolute";
	this.timegrid.style.top = this.editor.timebarHeight + "px";
	this.timegrid.style.left = "0px";
	this.timegrid.style.width = width + "px";
	this.timegrid.style.height = height + "px";
	this.timegrid.width = width;
	this.timegrid.height = height;
	this.editor.tracks.element.appendChild(this.timegrid);

	var context = this.timegrid.getContext("2d");
	context.fillStyle = Editor.theme.barColor;
	for(var l = 0; l <= height; l += 30)
	{
		context.fillRect(0, l, width, 1);
	}
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
	this.editor.tracks.element.appendChild(this.seek);

	//Seekbar manager
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

	//Tracks
	for(var j = 0; j < tracks.length; j++)
	{
		var track = new AnimationTrack(this.editor.tracks, this.editor, tracks[j]);
		track.position.set(0, this.editor.timebarHeight);
		track.size.set(this.editor.zoom * animation.duration, 30);
		track.updateInterface();
		
		var button = new AnimationTrackButton(this.editor.info, this.editor, animation, tracks[j], track);
		button.position.set(0, this.editor.timebarHeight);
		button.size.set(0, 30);
		button.updateInterface();

		this.editor.timebarHeight += 30;
	}
}
