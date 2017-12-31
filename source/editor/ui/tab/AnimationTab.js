"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Animation", Editor.filePath + "icons/misc/animation.png");

	var self = this;

	this.mixer = null;
	this.object = null;
	this.clock = new THREE.Clock();
	
	this.zoom = 120.0; //Pixels/sec
	this.timelineHeight = 30; //Pixels

	//Bar
	this.bar = document.createElement("div");
	this.bar.style.position = "absolute";
	this.bar.style.overflow = "visible";
	this.bar.style.height = "20px";
	this.bar.style.backgroundColor = Editor.theme.barColor;
	this.element.appendChild(this.bar);

	//Animation
	this.animationButton = new Button(this.bar);
	this.animationButton.position.set(0, 0);
	this.animationButton.size.set(100, 20);
	this.animationButton.setText("Create")
	this.animationButton.updateInterface();
	this.animationButton.setCallback(function()
	{
		if(self.object !== null)
		{
			if(self.object.animations !== undefined)
			{
				alert("This object is already animated");
				return;
			}

			self.object.animations = [];

			//VectorKeyframeTrack | BooleanKeyframeTrack | ColorKeyframeTrack | NumberKeyframeTrack | QuaternionKeyframeTrack | StringKeyframeTrack
			
			var clip = new THREE.AnimationClip("Animation", 5, []);
			
			var position = new VectorKeyframeTrack(".position", [1, 2, 2.5, 3, 4.5], [0,0,0, 1,1,1, 2,1,2, 2,2,2, 0,0,0]);
			position.setInterpolation(THREE.InterpolateSmooth); //InterpolateLinear || InterpolateSmooth || InterpolateDiscrete
			clip.tracks.push(position);

			var scale = new VectorKeyframeTrack(".scale", [0, 1, 2, 3], [1,1,1, 2,2,2, 0.5,0.5,0.5, 1,1,1]);
			scale.setInterpolation(THREE.InterpolateLinear);
			clip.tracks.push(scale);

			var quaternion = new QuaternionKeyframeTrack(".quaternion", [0, 1.5, 3], [0,0,0,1, 0,0.706825181105366,0,0.7073882691671998, 0,0,0,1]);
			quaternion.setInterpolation(THREE.InterpolateLinear);
			clip.tracks.push(quaternion);
			
			var visible = new BooleanKeyframeTrack(".visible", [0, 1.5, 2.0, 4.0], [true, false, true, true]);
			clip.tracks.push(visible);

			self.object.animations.push(clip);

			self.attach(self.object);
			self.updateTimeline();
		}
	});

	this.play = new Button(this.bar);
	this.play.position.set(100, 0);
	this.play.size.set(100, 20);
	this.play.setText("Play")
	this.play.updateInterface();
	this.play.setCallback(function()
	{
		if(self.mixer == null)
		{
			alert("No animation found!");
			return;
		}

		if(self.mixer.playing)
		{
			self.mixer.pause();
			self.play.setText("Play");
		}
		else
		{
			self.mixer.play();
			self.play.setText("Pause");
		}
	});

	this.stop = new Button(this.bar);
	this.stop.position.set(200, 0);
	this.stop.size.set(100, 20);
	this.stop.setText("Stop");
	this.stop.updateInterface();
	this.stop.setCallback(function()
	{
		if(self.mixer == null || !self.mixer.playing)
		{
			alert("No animation playing!");
			return;
		}

		self.play.setText("Play");
		self.mixer.stop();
	});

	this.zoomSlider = new Slider(this.bar);
	this.zoomSlider.size.set(150, 10);
	this.zoomSlider.position.set(400, 0);
	this.zoomSlider.setStep(10);
	this.zoomSlider.setRange(50, 1000);
	this.zoomSlider.updateInterface();
	this.zoomSlider.setValue(this.zoom);
	this.zoomSlider.setOnChange(function()
	{
		self.zoom = self.zoomSlider.getValue();
		self.updateTimeline();
	});

	//Timeline
	this.timeline = document.createElement("div");
	this.timeline.style.position = "absolute";
	this.timeline.style.overflow = "auto";
	this.timeline.style.top = "20px";
	this.element.appendChild(this.timeline);

	//Track information
	this.info = document.createElement("div");
	this.info.style.position = "absolute";
	this.info.style.width = "150px";
	this.info.style.backgroundColor = Editor.theme.barColor;
	this.timeline.appendChild(this.info);

	//Resize tab
	this.tab = document.createElement("div");
	this.tab.style.position = "absolute";
	this.tab.style.left = "150px";
	this.tab.style.width = "3px";
	this.tab.style.backgroundColor = Editor.theme.barColor;
	this.tab.style.cursor = "e-resize";
	this.timeline.appendChild(this.tab);

	//Tracks
	this.tracks = document.createElement("div");
	this.tracks.style.position = "absolute";
	this.tracks.style.left = "153px";
	this.tracks.style.width = "300px";
	this.tracks.style.backgroundColor = Editor.theme.panelColor;
	this.timeline.appendChild(this.tracks);

	//Seekbar
	this.seek = document.createElement("div");
	this.seek.style.position = "absolute";
	this.seek.style.backgroundColor = "#FFFFFF";
	this.seek.style.zIndex = "100";
	this.seek.style.top = "0px";
	this.seek.style.left = "0px";
	this.seek.style.width = "3px";
	this.seek.style.overflow = "hidden";
	this.seek.style.cursor = "e-resize";
	this.tracks.appendChild(this.seek);

	this.seek.onmousedown = function(event)
	{
		if(self.mixer !== undefined)
		{
			self.seekInitialTime = self.mixer._actions[0].time;
			self.mouse.set(event.clientX, event.clientY);
			self.manager.create();
		}
	};

	this.seekInitialTime = 0;
	this.mouse = new THREE.Vector2();

	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		var time = self.seekInitialTime + (event.clientX - self.mouse.x) / self.zoom;
		self.mixer.setTime(time > 0 ? time : 0);
	});

	this.manager.add(window, "mouseup", function(event)
	{
		self.manager.destroy();
	});
}

AnimationTab.prototype = Object.create(TabElement.prototype);

AnimationTab.prototype.attach = function(object)
{
	this.object = object;

	if(this.mixer !== null)
	{
		if(this.mixer._root !== object)
		{
			this.mixer.dispose();
			this.mixer = null;
		}
		else
		{
			return;
		}
	}

	if(object.animations !== undefined)
	{
		this.mixer = new AnimationMixer(object);
		this.mixer.createActions(object.animations);
	}
	
	this.updateTimeline();
};

AnimationTab.prototype.update = function()
{
	if(this.mixer !== null)
	{
		if(this.mixer._actions.length === 1)
		{
			this.seek.style.left = (this.mixer._actions[0].time * this.zoom - 1) + "px";
		}
		else
		{
			this.seek.style.left = (this.mixer.time * this.zoom - 1) + "px";
		}

		this.mixer.update(this.clock.getDelta());
	}
};

AnimationTab.prototype.updateTimeline = function()
{
	while(this.tracks.firstChild)
	{
		this.tracks.removeChild(this.tracks.firstChild);
	}
	while(this.info.firstChild)
	{
		this.info.removeChild(this.info.firstChild);
	}

	if(this.object === null || this.object.animations === undefined)
	{
		return;
	}

	this.tracks.appendChild(this.seek);

	var animations = this.object.animations;			

	var duration = 0;
	var y = 0;

	var timescale = document.createElement("canvas");
	timescale.style.position = "absolute";
	timescale.style.top = "0px";
	timescale.style.left = "0px";
	this.tracks.appendChild(timescale);

	//Animations
	for(var i = 0; i < animations.length; i++)
	{
		var tracks = animations[i].tracks;

		var name = document.createElement("div");
		name.style.height = this.timelineHeight + "px";
		name.innerHTML = animations[i].name;
		this.info.appendChild(name);

		var block = document.createElement("div");
		block.style.height = this.timelineHeight + "px";
		//block.style.backgroundColor = Editor.theme.barColor;
		//block.innerHTML = " UUID: " + animations[i].uuid + " | Duration: " + animations[i].duration + " s";
		this.tracks.appendChild(block);

		y += this.timelineHeight;

		//Tracks
		for(var j = 0; j < tracks.length; j++)
		{
			var times = tracks[j].times;

			var name = document.createElement("div");
			name.style.height = this.timelineHeight + "px";
			name.innerHTML = tracks[j].name;
			this.info.appendChild(name);

			var track = document.createElement("div");
			track.style.height = this.timelineHeight + "px";
			this.tracks.appendChild(track);

			y += this.timelineHeight;

			var color = MathUtils.randomColor();

			for(var k = 0; k < times.length; k++)
			{
				var key = document.createElement("div");
				key.style.position = "absolute";
				key.style.cursor = "pointer";
				key.style.backgroundColor =  color;
				key.style.height = this.timelineHeight + "px";
				key.style.left = (this.zoom * times[k] - 2) + "px";
				key.style.width = "5px";
				track.appendChild(key);
			}
		}

		if(animations[i].duration > duration)
		{
			duration = animations[i].duration;
		}
	}

	//Draw timeline canvas
	var width = this.zoom * duration;
	var height = y;

	timescale.style.width = width + "px";
	timescale.style.height = height + "px";
	timescale.width = width;
	timescale.height = height;

	var context = timescale.getContext("2d");
	context.fillStyle = "#444444";

	//Horizontal lines
	for(var i = 0; i <= height; i += this.timelineHeight)
	{
		context.fillRect(0, i, width, 1);
	}

	//Vertical lines
	for(var i = 0, step = this.zoom / 10; i <= width; i += step)
	{
		context.fillRect(i, 0, 1, height);
	}
};

AnimationTab.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		this.bar.style.width = this.size.x + "px";

		this.timeline.style.width = this.size.x + "px";
		this.timeline.style.height = (this.size.y - 20) + "px";

		this.seek.style.height = this.timeline.style.height;
		
		this.info.style.height = this.timeline.style.height;
		this.tab.style.height = this.timeline.style.height;
		
		this.tracks.style.height = this.timeline.style.height;
		this.tracks.style.width = (this.size.x - 153) + "px";;
	}
	else
	{
		this.element.style.display = "none";
	}
};

