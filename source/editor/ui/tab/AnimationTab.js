"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Animation", Editor.filePath + "icons/misc/animation.png");

	var self = this;

	this.mixer = null;

	this.zoom = 120.0; //Pixels/sec
	this.timelineHeight = 30; //Pixels

	//Bar
	this.bar = document.createElement("div");
	this.bar.style.backgroundColor = Editor.theme.barColor;
	this.bar.style.overflow = "visible";
	this.bar.style.position = "absolute";
	this.bar.style.width = "100%";
	this.bar.style.height = "20px";
	this.element.appendChild(this.bar);

	//Timeline
	this.timeline = document.createElement("div");
	this.timeline.style.overflow = "auto";
	this.timeline.style.position = "absolute";
	this.timeline.style.top = "20px";
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

	//Animation
	this.animationButton = new Button(this.bar);
	this.animationButton.position.set(0, 0);
	this.animationButton.size.set(100, 20);
	this.animationButton.setText("Create Animation")
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
			}

			//VectorKeyframeTrack
			//BooleanKeyframeTrack
			//ColorKeyframeTrack
			//NumberKeyframeTrack
			//QuaternionKeyframeTrack
			//StringKeyframeTrack

			var clip = new THREE.AnimationClip("Animation", 5, []);

			var position = new VectorKeyframeTrack(".position", [1, 2, 2.5, 3, 4.5], [0,0,0, 1,1,1, 2,1,2, 2,2,2, 0,0,0]);
			position.setInterpolation(THREE.InterpolateSmooth); //InterpolateLinear || InterpolateSmooth || InterpolateDiscrete
			clip.tracks.push(position);

			var scale = new VectorKeyframeTrack(".scale", [0, 1, 2, 3], [1,1,1, 2,2,2, 0.5,0.5,0.5, 1,1,1]);
			scale.setInterpolation(THREE.InterpolateLinear); //InterpolateLinear || InterpolateSmooth || InterpolateDiscrete
			clip.tracks.push(scale);

			object.animations.push(clip);
		}

		update();
	});

	//Update
	this.updateButton = new Button(this.bar);
	this.updateButton.position.set(100, 0);
	this.updateButton.size.set(100, 20);
	this.updateButton.setText("Update")
	this.updateButton.updateInterface();
	this.updateButton.setCallback(function()
	{
		update();
	});

	this.play = new Button(this.bar);
	this.play.position.set(200, 0);
	this.play.size.set(100, 20);
	this.play.setText("Play")
	this.play.updateInterface();
	this.play.setCallback(function()
	{
		if(self.mixer !== null)
		{
			alert("Already playing!");
			return;
		}

		if(Editor.selectedObjects.length > 0 && Editor.selectedObjects[0].animations !== undefined)
		{
			var object = Editor.selectedObjects[0];
			self.mixer = new THREE.AnimationMixer(object);

			for(var i = 0; i < object.animations.length; i++)
			{
				var action = self.mixer.clipAction(object.animations[i]);
				action.setLoop(THREE.LoopRepeat); //LoopOnce || LoopRepeat || LoopPingPong
				action.play(); 
			}

			var clock = new THREE.Clock();
			clock.start();

			var loop = function()
			{
				if(self.mixer !== null)
				{
					self.mixer.update(clock.getDelta());
					requestAnimationFrame(loop);
				}
			};
			loop();
		}
		else
		{
			alert("Object not found!");
		}
	});

	this.stop = new Button(this.bar);
	this.stop.position.set(300, 0);
	this.stop.size.set(100, 20);
	this.stop.setText("Stop")
	this.stop.updateInterface();
	this.stop.setCallback(function()
	{
		if(self.mixer !== null)
		{
			self.mixer.stopAllAction();
			self.mixer = null;
		}
	});

	this.zoomSlider = new Slider(this.bar);
	this.zoomSlider.size.set(100, 20);
	this.zoomSlider.position.set(500, 0);
	this.zoomSlider.setStep(10);
	this.zoomSlider.setRange(50, 1000);
	this.zoomSlider.updateInterface();
	this.zoomSlider.setOnChange(function()
	{
		self.zoom = self.zoomSlider.getValue();
		update();
	});

	function update()
	{
		if(Editor.selectedObjects.length > 0 && Editor.selectedObjects[0].animations !== undefined)
		{	
			//Clean animation division
			if(self.animation !== undefined)
			{
				self.timeline.removeChild(self.animation);
			}

			self.animation = document.createElement("div");
			self.animation.style.overflow = "visible";
			self.animation.style.position = "absolute";
			self.animation.style.width = "100%";
			self.animation.style.height = "100%";
			self.animation.style.display = "table-cell";
			self.timeline.appendChild(self.animation);

			var info = document.createElement("div");
			info.style.position = "absolute";
			info.style.width = "50px";
			info.style.height = "100%";
			info.style.backgroundColor = "#FF0000";
			self.animation.appendChild(info);

			var tab = document.createElement("div");
			tab.style.position = "absolute";
 			tab.style.left = "50px";
 			tab.style.width = "3px";
			tab.style.height = "100%";
			tab.style.backgroundColor = "#00FF00";
			tab.style.cursor = "e-resize";
			self.animation.appendChild(tab);

			var tracks = document.createElement("div");
			tracks.style.position = "absolute";
			tracks.style.left = "53px";
			tracks.style.width = "300px";
			tracks.style.height = "100%";
			tracks.style.backgroundColor = "#0000FF";
			self.animation.appendChild(tracks);

			/*
			var object = Editor.selectedObjects[0];
			var animations = object.animations;			
			var trackCount = 0, duration = 0;

			for(var i = 0; i < animations.length; i++)
			{
				var tracks = animations[i].tracks;

				var animation = document.createElement("div");
				animation.style.height = (self.timelineHeight * (tracks.length + 1)) + "px";
				animation.style.width = (self.zoom * animations[i].duration + 50) + "px";
				self.animation.appendChild(animation);

				var animationName = document.createElement("div");
				animationName.style.height = self.timelineHeight + "px";
				animationName.innerHTML = animations[i].name;
				animation.appendChild(animationName);

				for(var j = 0; j < tracks.length; j++)
				{
					var times = tracks[j].times;

					var track = document.createElement("div");
					track.style.height = self.timelineHeight + "px";
					track.style.width = (self.zoom * (times[times.length - 1] - times[0])) + "px";
					animation.appendChild(track);

					var color = MathUtils.randomColor();

					for(var k = 0; k < times.length - 1; k++)
					{
						var key = document.createElement("div");
						key.style.position = "absolute";
						key.style.cursor = "pointer";
						key.style.backgroundColor = color;
						key.style.width = "3px";
						key.style.height = self.timelineHeight + "px";
						key.style.left = (self.zoom * times[k] - 1) + "px";
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
			self.animation.insertAdjacentElement("afterbegin", timescale);

			//Update timescale
			var width = self.zoom * duration;
			if(width < self.size.x)
			{
				width = self.size.x;
			}

			var height = self.timelineHeight * trackCount;
			if(height < self.size.y)
			{
				height = self.size.y;
			}

			timescale.width = width;
			timescale.height = height;
			timescale.style.width = width + "px";
			timescale.style.height = height + "px";

			var context = timescale.getContext("2d");
			context.fillStyle = "#444444";

			//Horizontal lines
			for(var i = 0; i <= height; i += self.timelineHeight)
			{
				context.fillRect(0, i, width, 1);
			}

			//Vertical lines
			for(var i = 0; i <= width; i += self.zoom)
			{
				context.fillRect(i - 1, 0, 3, height);
			}

			for(var i = 0, step = self.zoom / 5; i <= width; i += step)
			{
				context.fillRect(i, 0, 1, height);
			}

			self.updateInterface();

			*/
		}
	};
}

AnimationTab.prototype = Object.create(TabElement.prototype);

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
	}
};

//Update interface
AnimationTab.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";

		this.timeline.style.height = (this.size.y - 20) + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};

