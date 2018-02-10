"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Animation", Editor.filePath + "icons/misc/animation.png");

	var self = this;

	this.mixer = null;
	this.object = null;
	this.clock = new THREE.Clock();
	
	this.zoom = 120.0; //Pixels/sec
	this.timebarHeight = 0;
	this.animations = [];

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
	this.zoomSlider.size.set(100, 10);
	this.zoomSlider.position.set(30, 2);
	this.zoomSlider.setStep(10);
	this.zoomSlider.setRange(20, 1000);
	this.zoomSlider.updatePosition(Element.TOP_RIGHT);
	this.zoomSlider.updateSize();
	this.zoomSlider.setValue(this.zoom);
	this.zoomSlider.setOnChange(function()
	{
		self.zoom = self.zoomSlider.getValue();
		self.createTimeline();
	});

	this.zoomSlider.text.style.right = "5px";

	this.zoomText = new Text(this.bar);
	this.zoomText.setText("Zoom");
	this.zoomText.size.set(90, 20);
	this.zoomText.position.set(110, 0);
	this.zoomText.updatePosition(Element.TOP_RIGHT);
	this.zoomText.updateSize();

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
	var mouse = 0, initial = 0;

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
		mouse = event.clientX;
		initial = this.position;
		self.tabManager.create();
	};

	this.tabManager = new EventManager();
	this.tabManager.add(window, "mousemove", function(event)
	{
		self.tab.position = initial + (event.clientX - mouse);
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
}

AnimationTab.prototype = Object.create(TabElement.prototype);

AnimationTab.prototype.attach = function()
{
	TabElement.prototype.attach.call(this);

	this.createTimeline();
};

AnimationTab.prototype.activate = function()
{
	TabElement.prototype.activate.call(this);

	this.updateSelection();
};

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
AnimationTab.prototype.updateSelection = function()
{
	this.object = Editor.selectedObjects.length > 0 ? Editor.selectedObjects[0] : null;
	
	this.createAnimationMixer();
	this.createTimeline();
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
	if(this.object !== null && this.object.animations !== undefined)
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
		for(var i = 0; i < this.mixer._actions.length; i++)
		{
			this.animations[i].seek.style.left = (this.mixer._actions[i].time * this.zoom) + "px";
		}

		this.mixer.update(this.clock.getDelta());

		//Update object panel when playing
		if(this.mixer.playing)
		{
			Interface.panel.updatePanel();
		}
	}
};

//Create new timeline elements
AnimationTab.prototype.createTimeline = function()
{	
	//Clear timeline elements
	while(this.tracks.firstChild)
	{
		this.tracks.removeChild(this.tracks.firstChild);
	}
	while(this.info.firstChild)
	{
		this.info.removeChild(this.info.firstChild);
	}

	this.timebarHeight = 0;
	this.animations = [];

	//Create new timeline
	if(this.object !== null && this.object.animations !== undefined)
	{
		var animations = this.object.animations;
		for(var i = 0; i < animations.length; i++)
		{
			this.animations.push(new AnimationClipTrack(this, animations[i]));
		}
	}

	this.updateInterface();
};

AnimationTab.prototype.addKeyFrame = function(track, object)
{
	var attributes = track.name.split(".");
	var value = object;

	for(var i = 0; i < attributes.length; i++)
	{
		if(attributes !== "")
		{
			var newValue = value[attributes[i]];
			
			if(newValue !== undefined)
			{
				value = newValue;
			}
		}
	}

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
	}
	else
	{
		this.element.style.display = "none";
	}
};
