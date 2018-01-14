"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Animation", Editor.filePath + "icons/misc/animation.png");

	var self = this;

	this.mixer = null;
	this.object = null;
	this.clock = new THREE.Clock();
	
	this.zoom = 120.0; //Pixels/sec

	//Bar
	this.bar = document.createElement("div");
	this.bar.style.position = "absolute";
	this.bar.style.height = "20px";
	this.bar.style.backgroundColor = Editor.theme.barColor;
	this.element.appendChild(this.bar);

	//Animation
	this.animationButton = new Button(this.bar);
	this.animationButton.position.set(0, 0);
	this.animationButton.size.set(100, 20);
	this.animationButton.setText("Add")
	this.animationButton.updateInterface();
	this.animationButton.setCallback(function()
	{
		if(self.object !== null)
		{
			if(self.object.animations === undefined)
			{
				self.object.animations = [];
			}

			//VectorKeyframeTrack | BooleanKeyframeTrack | ColorKeyframeTrack | NumberKeyframeTrack | QuaternionKeyframeTrack | StringKeyframeTrack
			var clip = new AnimationClip("Animation" + self.object.animations.length, 10, []);
			
			var position = new THREE.VectorKeyframeTrack(".position", [0], self.object.position.toArray());
			position.setInterpolation(THREE.InterpolateLinear);
			position.setColor("#FF0000");
			clip.tracks.push(position);

			var scale = new THREE.VectorKeyframeTrack(".scale", [0], self.object.scale.toArray());
			scale.setInterpolation(THREE.InterpolateLinear);
			scale.setColor("#00FF00");
			clip.tracks.push(scale);

			var quaternion = new THREE.QuaternionKeyframeTrack(".quaternion", [0], self.object.quaternion.toArray());
			quaternion.setInterpolation(THREE.InterpolateLinear);
			quaternion.setColor("#0000FF");
			clip.tracks.push(quaternion);
			
			var visible = new THREE.BooleanKeyframeTrack(".visible", [0], [self.object.visible]);
			visible.setInterpolation(THREE.InterpolateDiscrete);
			visible.setColor("#FFFF00");
			clip.tracks.push(visible);

			self.object.animations.push(clip);
			self.attach(self.object);
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
		if(self.mixer == null)
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
	this.zoomSlider.setRange(20, 1000);
	this.zoomSlider.updateInterface();
	this.zoomSlider.setValue(this.zoom);
	this.zoomSlider.setOnChange(function()
	{
		self.zoom = self.zoomSlider.getValue();
		self.createTimeline();
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
	this.info.style.backgroundColor = Editor.theme.barColor;
	this.timeline.appendChild(this.info);

	//Temporary variables for mouse movement
	var mouse = new THREE.Vector2();
	var initial = 0;

	//Resize tab
	this.tab = document.createElement("div");
	this.tab.style.position = "absolute";
	this.tab.style.width = "5px";
	this.tab.style.backgroundColor = Editor.theme.barColor;
	this.tab.style.cursor = "e-resize";
	this.tab.position = 250;
	this.timeline.appendChild(this.tab);

	this.tab.onmousedown = function(event)
	{
		mouse.set(event.clientX, event.clientY);
		initial = this.position;
		self.tabManager.create();
	};

	this.tabManager = new EventManager();
	this.tabManager.add(window, "mousemove", function(event)
	{
		self.tab.position = initial + (event.clientX - mouse.x);
		self.updateInterface();
	});

	this.tabManager.add(window, "mouseup", function(event)
	{
		self.tabManager.destroy();
	});

	//Tracks
	this.tracks = document.createElement("div");
	this.tracks.style.position = "absolute";
	this.tracks.style.backgroundColor = Editor.theme.panelColor;
	this.timeline.appendChild(this.tracks);

	//Seekbar
	this.seek = document.createElement("div");
	this.seek.style.position = "absolute";
	this.seek.style.backgroundColor = "#FFFFFF";
	this.seek.style.zIndex = "100";
	this.seek.style.top = "0px";
	this.seek.style.left = "0px";
	this.seek.style.width = "4px";
	this.seek.style.overflow = "hidden";
	this.seek.style.cursor = "e-resize";
	this.seek.onmousedown = function(event)
	{
		if(self.mixer !== null)
		{
			initial = self.mixer._actions[0].time;
			mouse.set(event.clientX, event.clientY);
			self.manager.create();
		}
	};

	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		var time = initial + (event.clientX - mouse.x) / self.zoom;
		self.mixer.setTime(time > 0 ? time : 0);
		
		Interface.panel.updatePanel();
	});

	this.manager.add(window, "mouseup", function(event)
	{
		self.manager.destroy();
	});
}

AnimationTab.prototype = Object.create(TabElement.prototype);

AnimationTab.prototype.deactivate = function()
{
	TabElement.prototype.deactivate.call(this);

	if(this.mixer !== null && this.mixer.playing)
	{
		this.play.setText("Play");
		this.mixer.stop();
	}
};

//Attach object to animation editor
AnimationTab.prototype.attach = function(object)
{
	this.object = object;
	this.createAnimationMixer();

	//Create timeline and animation mixer
	if(this.object.animations !== undefined)
	{
		this.createTimeline();
	}
	else
	{
		this.clearTimeline();
	}
};

//Create a new animation mixer
AnimationTab.prototype.createAnimationMixer = function(keepTime)
{
	var time = 0;

	//Remove old mixer
	if(this.mixer !== null)
	{
		if(keepTime)
		{
			time = this.mixer.time;
		}

		this.play.setText("Play");
		this.mixer.stop();
		this.mixer.dispose();
		this.mixer = null;
	}

	//Check if the object has animations
	if(this.object.animations !== undefined)
	{
		this.mixer = new AnimationMixer(this.object);
		this.mixer.createActions(this.object.animations);
		this.mixer.setTime(time);
	}
};

AnimationTab.prototype.update = function()
{
	if(this.mixer !== null)
	{
		if(this.mixer._actions.length > 0)
		{
			this.seek.style.left = (this.mixer._actions[0].time * this.zoom) + "px";
		}
		else
		{
			this.seek.style.left = (this.mixer.time * this.zoom) + "px";
		}

		this.mixer.update(this.clock.getDelta());

		//Update object panel when playing
		if(this.mixer.playing)
		{
			Interface.panel.updatePanel();
		}
	}
};

//Clear timeline division
AnimationTab.prototype.clearTimeline = function()
{
	while(this.tracks.firstChild)
	{
		this.tracks.removeChild(this.tracks.firstChild);
	}
	while(this.info.firstChild)
	{
		this.info.removeChild(this.info.firstChild);
	}
};

//Create new timeline elements
AnimationTab.prototype.createTimeline = function()
{
	this.clearTimeline();

	if(this.object === null || this.object.animations === undefined)
	{
		return;
	}

	this.tracks.appendChild(this.seek);

	var self = this;

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
		var button = new AnimationButton(this.info, this, animations[i]);
		button.position.set(0, y);
		button.size.set(0, 30);
		button.updateInterface();

		var block = document.createElement("div");
		block.style.position = "absolute";
		block.style.top = y + "px";
		block.style.left = "0px";
		block.style.height = "30px";
		block.style.backgroundColor = Editor.theme.barColor;
		this.tracks.appendChild(block);

		var text = new Text(block);
		text.position.set(5, 5);
		text.size.set(50, 20);
		text.setText("Enabled");
		text.updateInterface();

		var enabled = new CheckBox(block);
		enabled.position.set(55, 5);
		enabled.size.set(15, 15);
		enabled.updateInterface();
		enabled.element.element = enabled;
		enabled.element.animation = animations[i];
		enabled.setValue(animations[i].enabled);
		enabled.setOnChange(function()
		{
			this.animation.enabled = this.element.getValue();
			self.createAnimationMixer(true);
		});

		var text = new Text(block);
		text.position.set(70, 5);
		text.size.set(100, 20);
		text.setText("Duration");
		text.updateInterface();

		var duration = new NumberBox(block);
		duration.position.set(150, 5);
		duration.size.set(60, 18);
		duration.updateInterface();
		duration.element.element = duration;
		duration.element.animation = animations[i];
		duration.setValue(animations[i].duration);
		duration.setOnChange(function()
		{
			this.animation.duration = this.element.getValue();

			self.createTimeline();
			self.createAnimationMixer();
		});

		var text = new Text(block);
		text.position.set(190, 5);
		text.size.set(100, 20);
		text.setText("Loop");
		text.updateInterface();

		var loop = new DropdownList(block);
		loop.position.set(260, 5);
		loop.size.set(90, 18);
		loop.addValue("Once", THREE.LoopOnce);
		loop.addValue("Repeat", THREE.LoopRepeat);
		loop.addValue("PingPong", THREE.LoopPingPong);
		loop.updateInterface();
		loop.element.element = loop;
		loop.element.animation = animations[i];
		loop.setValue(animations[i].loop);
		loop.setOnChange(function()
		{
			this.animation.loop = this.element.getValue();
			self.createAnimationMixer(true);
		});

		var text = new Text(block);
		text.position.set(335, 5);
		text.size.set(100, 20);
		text.setText("Speed");
		text.updateInterface();

		var timeScale = new NumberBox(block);
		timeScale.position.set(410, 5);
		timeScale.size.set(60, 18);
		timeScale.updateInterface();
		timeScale.element.element = timeScale;
		timeScale.element.animation = animations[i];
		timeScale.setValue(animations[i].timeScale);
		timeScale.setOnChange(function()
		{
			this.animation.timeScale = this.element.getValue();
			self.createAnimationMixer(true);
		});

		y += 30;

		//Timegrid
		var timegrid = document.createElement("canvas");
		timegrid.style.position = "absolute";
		timegrid.style.top = y + "px";
		timegrid.style.left = "0px";
		this.tracks.appendChild(timegrid);

		//Tracks
		var tracks = animations[i].tracks;
		for(var j = 0; j < tracks.length; j++)
		{
			var times = tracks[j].times;

			var button = new AnimationTrackButton(this.info, this, animations[i], tracks[j]);
			button.position.set(0, y);
			button.size.set(0, 30);
			button.updateInterface();

			var track = new AnimationTrack(this.tracks, this, tracks[j]);
			track.position.set(0, y);
			track.size.set(this.zoom * animations[i].duration, 30);
			track.updateInterface();
			track.createKeyframes();

			y += 30;
		}

		var duration = animations[i].duration;
		var width = this.zoom * duration + 1;
		var height = 30 * tracks.length + 1;

		//Block
		block.style.width = width + "px";
		
		//Timeline grid
		timegrid.style.width = width + "px";
		timegrid.style.height = height + "px";
		timegrid.width = width;
		timegrid.height = height;

		var context = timegrid.getContext("2d");
		context.fillStyle = Editor.theme.barColor;

		//Horizontal lines
		for(var l = 0; l <= height; l += 30)
		{
			context.fillRect(0, l, width, 1);
		}

		//Vertical lines
		for(var l = 0, step = this.zoom / 10; l <= width; l += step)
		{
			context.fillRect(l, 0, 1, height);
		}
	}

	this.updateInterface();

	//Timescale
	//timescale.style.width = width + "px";
	//timescale.style.height = height + "px";
	//timescale.width = width;
	//timescale.height = height;
};

AnimationTab.prototype.addKeyFrame = function(track, object)
{
	var names = track.name.split(".");
	var value = object[names[1]];

	value = (value.toArray !== undefined) ? value.toArray() : [value];

	//Check if there is already a keyframe with same time
	for(var i = 0; i < track.times.length; i++)
	{
		if(track.times[i] === this.mixer.time)
		{
			break;
		}
	}

	//If there is already a keyframe with time update values
	if(i < track.times.length)
	{
		var valueSize = track.getValueSize();
		var index = i * valueSize;

		for(var i = 0; i < valueSize; i++)
		{
			track.values[index] = value[i];
			index++;
		}
	}
	//Add new keyframe to track
	else
	{
		var times = [];
		for(var i = 0; i < track.times.length; i++)
		{
			times.push(track.times[i]);
		}
		times.push(this.mixer.time);

		var values = [];
		for(var i = 0; i < track.values.length; i++)
		{
			values.push(track.values[i]);
		}
		values = values.concat(value);

		track.times = new Float32Array(times);
		track.values = new Float32Array(values);

		track.sort();
	}

	this.createTimeline();
	this.createAnimationMixer(true);
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

		this.timeline.style.width = this.size.x + "px";
		this.timeline.style.height = (this.size.y - 20) + "px";
		
		this.bar.style.width = this.size.x + "px";

		//Resizable division
		this.info.style.height = this.timeline.scrollHeight + "px";
		this.info.style.width = this.tab.position + "px";

		this.tab.style.height = this.timeline.scrollHeight + "px";
		this.tab.style.left = this.info.style.width;
		
		this.tracks.style.left = (this.tab.position + 5) + "px";
		this.tracks.style.width = (this.size.x - this.tab.position - 5) + "px";

		//Seekbar
		this.seek.style.height = this.timeline.scrollHeight + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
