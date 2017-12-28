"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Animation", Editor.filePath + "icons/misc/animation.png");

	var self = this;

	this.mixer = null;
	this.clock = new THREE.Clock();
	
	this.zoom = 120.0; //Pixels/sec
	this.timelineHeight = 30; //Pixels

	//Bar
	this.bar = document.createElement("div");
	this.bar.style.backgroundColor = Editor.theme.barColor;
	this.bar.style.overflow = "visible";
	this.bar.style.position = "absolute";
	this.bar.style.width = "100%";
	this.bar.style.height = "30px";
	this.element.appendChild(this.bar);

	//Timeline
	this.timeline = document.createElement("div");
	this.timeline.style.overflow = "auto";
	this.timeline.style.position = "absolute";
	this.timeline.style.top = "30px";
	this.timeline.style.width = "100%";
	this.element.appendChild(this.timeline);

	//Seekbar
	this.seek = document.createElement("div");
	this.seek.style.backgroundColor = "#FFFFFF";
	this.seek.style.zIndex = "100";
	this.seek.style.width = "3px";
	this.seek.style.height = "100%";
	this.seek.style.overflow = "hidden";
	this.seek.style.top = "0px";
	this.seek.style.left = "0px";
	this.seek.style.position = "absolute";
	this.seek.style.cursor = "e-resize";
	this.timeline.appendChild(this.seek);

	this.seeking = false;
	this.seekInitialTime = 0;
	this.mouse = new THREE.Vector2();

	this.seek.onmousedown = function(event)
	{
		if(self.mixer !== null)
		{
			self.seeking = true;
			self.seekInitialTime = self.mixer._actions[0].time;
			self.mouse.set(event.clientX, event.clientY);
		}
	};

	this.manager = new EventManager();
	this.manager.add(window, "mousemove", function(event)
	{
		if(self.seeking)
		{
			self.mixer.setTime(self.seekInitialTime + (event.clientX - self.mouse.x) / self.zoom);
		}
	});
	this.manager.add(window, "mouseup", function(event)
	{
		self.seeking = false;
	});
	this.manager.create();

	//Animation
	this.animationButton = new Button(this.bar);
	this.animationButton.position.set(0, 0);
	this.animationButton.size.set(100, 30);
	this.animationButton.setText("Create")
	this.animationButton.updateInterface();
	this.animationButton.setCallback(function()
	{
		if(Editor.selectedObjects.length > 0)
		{
			var object = Editor.selectedObjects[0];

			if(object.animations !== undefined)
			{
				alert("This object is already animated");
				return;
			}
			else
			{
				object.animations = [];
	
				var clip = new THREE.AnimationClip("Animation", 5, []);

				//VectorKeyframeTrack
				//BooleanKeyframeTrack
				//ColorKeyframeTrack
				//NumberKeyframeTrack
				//QuaternionKeyframeTrack
				//StringKeyframeTrack
				//
				var position = new VectorKeyframeTrack(".position", [1, 2, 2.5, 3, 4.5], [0,0,0, 1,1,1, 2,1,2, 2,2,2, 0,0,0]);
				position.setInterpolation(THREE.InterpolateSmooth); //InterpolateLinear || InterpolateSmooth || InterpolateDiscrete
				clip.tracks.push(position);

				var scale = new VectorKeyframeTrack(".scale", [0, 1, 2, 3], [1,1,1, 2,2,2, 0.5,0.5,0.5, 1,1,1]);
				scale.setInterpolation(THREE.InterpolateLinear);
				clip.tracks.push(scale);

				var quaternion = new QuaternionKeyframeTrack(".quaternion", [0, 1.5, 3], [0,0,0,1, 0,0.706825181105366,0,0.7073882691671998, 0,0,0,1]);
				quaternion.setInterpolation(THREE.InterpolateLinear);
				clip.tracks.push(quaternion);
				
				object.animations.push(clip);
			}
		}

		self.updateTimeline();
	});

	this.play = new Button(this.bar);
	this.play.position.set(100, 0);
	this.play.size.set(100, 30);
	this.play.setText("Play")
	this.play.updateInterface();
	this.play.setCallback(function()
	{
		var object = Editor.selectedObjects[0];
		
		if(self.mixer !== null)
		{
			if(self.mixer._root !== object)
			{
				self.mixer.dispose();
				self.mixer = new AnimationMixer(object);
				self.mixer.createActions(object.animations);	
			}
		}
		else
		{
			self.mixer = new AnimationMixer(object);
			self.mixer.createActions(object.animations);
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
	this.stop.size.set(100, 30);
	this.stop.setText("Stop");
	this.stop.updateInterface();
	this.stop.setCallback(function()
	{
		self.play.setText("Play");
		self.mixer.stop();
	});

	this.zoomSlider = new Slider(this.bar);
	this.zoomSlider.size.set(100, 15);
	this.zoomSlider.position.set(400, 0);
	this.zoomSlider.setStep(10);
	this.zoomSlider.setRange(50, 1000);
	this.zoomSlider.updateInterface();
	this.zoomSlider.setOnChange(function()
	{
		self.zoom = self.zoomSlider.getValue();
		self.updateTimeline();
	});
	this.zoomSlider.setValue(this.zoom);
}

AnimationTab.prototype = Object.create(TabElement.prototype);

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
	if(Editor.selectedObjects.length > 0 && Editor.selectedObjects[0].animations !== undefined)
	{	
		//Clean animation division
		if(this.animation !== undefined)
		{
			this.timeline.removeChild(this.animation);
		}

		this.animation = document.createElement("div");
		this.animation.style.overflow = "visible";
		this.animation.style.position = "absolute";
		this.animation.style.width = "100%";
		this.animation.style.height = "100%";
		this.animation.style.display = "table-cell";
		this.timeline.appendChild(this.animation);

		/*var info = document.createElement("div");
		info.style.position = "absolute";
		info.style.width = "50px";
		info.style.height = "100%";
		info.style.backgroundColor = "#FF0000";
		this.animation.appendChild(info);

		var tab = document.createElement("div");
		tab.style.position = "absolute";
			tab.style.left = "50px";
			tab.style.width = "3px";
		tab.style.height = "100%";
		tab.style.backgroundColor = "#00FF00";
		tab.style.cursor = "e-resize";
		this.animation.appendChild(tab);

		var tracks = document.createElement("div");
		tracks.style.position = "absolute";
		tracks.style.left = "53px";
		tracks.style.width = "300px";
		tracks.style.height = "100%";
		tracks.style.backgroundColor = "#0000FF";
		this.animation.appendChild(tracks);*/

		var object = Editor.selectedObjects[0];
		var animations = object.animations;			
		var trackCount = 0, duration = 0;

		for(var i = 0; i < animations.length; i++)
		{
			var tracks = animations[i].tracks;

			var animation = document.createElement("div");
			animation.style.height = (this.timelineHeight * (tracks.length + 1)) + "px";
			animation.style.width = "100%";
			animation.style.zIndex = 10;
			this.animation.appendChild(animation);

			var name = document.createElement("div");
			name.style.height = this.timelineHeight + "px";
			name.style.width = "100%";
			name.style.backgroundColor = "#222222";
			name.innerHTML = animations[i].name;
			animation.appendChild(name);

			for(var j = 0; j < tracks.length; j++)
			{
				var times = tracks[j].times;

				var track = document.createElement("div");
				track.style.height = this.timelineHeight + "px";
				track.style.width = (this.zoom * (times[times.length - 1] - times[0])) + "px";
				animation.appendChild(track);

				var color = MathUtils.randomColor();

				for(var k = 0; k < times.length - 1; k++)
				{
					var key = document.createElement("div");
					key.style.position = "absolute";
					key.style.cursor = "pointer";
					key.style.backgroundColor = color;
					key.style.width = "3px";
					key.style.height = this.timelineHeight + "px";
					key.style.left = (this.zoom * times[k] - 1) + "px";
					track.appendChild(key);
				}

				trackCount++;
			}

			if(animations[i].duration > duration)
			{
				duration = animations[i].duration;
			}
		}

		var timescale = document.createElement("canvas");
		timescale.style.position = "absolute";
		timescale.style.top = "0px";
		timescale.style.left = "0px";
		this.animation.insertAdjacentElement("afterbegin", timescale);

		//Update timescale
		var width = this.zoom * duration;
		if(width < this.size.x)
		{
			width = this.size.x;
		}

		var height = this.timelineHeight * trackCount;
		if(height < this.size.y)
		{
			height = this.size.y;
		}

		timescale.width = width;
		timescale.height = height;
		timescale.style.width = width + "px";
		timescale.style.height = height + "px";

		var context = timescale.getContext("2d");
		context.fillStyle = "#444444";

		//Horizontal lines
		for(var i = 0; i <= height; i += this.timelineHeight)
		{
			context.fillRect(0, i, width, 1);
		}

		//Vertical lines
		for(var i = 0; i <= width; i += this.zoom)
		{
			context.fillRect(i - 1, 0, 3, height);
		}

		for(var i = 0, step = this.zoom / 5; i <= width; i += step)
		{
			context.fillRect(i, 0, 1, height);
		}

		this.updateInterface();
	}
};

AnimationTab.prototype.destroy = function()
{
	TabElement.prototype.destroy.call(this);

	this.manager.destroy();
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

		this.timeline.style.height = (this.size.y - 30) + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};

