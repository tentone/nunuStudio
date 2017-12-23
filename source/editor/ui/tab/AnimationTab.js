"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Animation", Editor.filePath + "icons/misc/animation.png");

	var self = this;

 	this.obj = null;
 	
 	//Scale in pixels per second
 	this.scale = 20.0;
 	
 	//Playback
 	this.mixer = null;
 	this.time = 0.0;
 	this.playing = false;

	//Bar
	this.bar = document.createElement("div");
	this.bar.style.backgroundColor = Editor.theme.barColor;
	this.bar.style.overflow = "visible";
	this.bar.style.position = "absolute";
	this.bar.style.width = "100%";
	this.bar.style.height = "20px";
	this.element.appendChild(this.bar);

	//Timeline zone
	this.timeline = document.createElement("div");
	this.timeline.style.overflow = "auto";
	this.timeline.style.position = "absolute";
	this.timeline.style.top = "20px";
	this.timeline.style.width = "100%";
	this.element.appendChild(this.timeline);

	//Animation
	this.animationButton = new Button(this.bar);
	this.animationButton.position.set(0, 0);
	this.animationButton.size.set(100, 20);
	this.animationButton.setText("Read Animations")
	this.animationButton.updateInterface();
	this.animationButton.setCallback(function()
	{
		if(Editor.selectedObjects.length > 0)
		{
			var object = Editor.selectedObjects[0];

			if(object.animations !== undefined)
			{
				console.log(object.animations);
				alert("This object is already animated");
			}
			else
			{
				alert("Added animation array");
				object.animations = [];
			}

			self.obj = object;
		}
	});

	this.clipButton = new Button(this.bar);
	this.clipButton.position.set(100, 0);
	this.clipButton.size.set(100, 20);
	this.clipButton.setText("Create Clip")
	this.clipButton.updateInterface();
	this.clipButton.setCallback(function()
	{
		if(Editor.selectedObjects.length > 0)
		{
			var object = Editor.selectedObjects[0];

			if(object.animations !== undefined)
			{	
				//VectorKeyframeTrack -> Vector3
				//BooleanKeyframeTrack
				//ColorKeyframeTrack
				//NumberKeyframeTrack
				//QuaternionKeyframeTrack
				//StringKeyframeTrack

				var clip = new THREE.AnimationClip("Animation", 3, []);

				var position = new VectorKeyframeTrack(".position", [0, 1, 2, 3], [0,0,0, 0,2,0, 2,1,2, 0,0,0]);
				position.setInterpolation(THREE.InterpolateSmooth); //InterpolateLinear || InterpolateSmooth || InterpolateDiscrete
				clip.tracks.push(position);

				clip.tracks.push(new VectorKeyframeTrack(".rotation", [0, 1, 2], [0,0,0, 0,1.57,0, 0,0,0]));
				object.animations.push(clip);

				alert("Added clip");
			}
		}
	});

	//Update
	this.updateButton = new Button(this.bar);
	this.updateButton.position.set(200, 0);
	this.updateButton.size.set(100, 20);
	this.updateButton.setText("Update")
	this.updateButton.updateInterface();
	this.updateButton.setCallback(function()
	{
		if(self.obj !== null)
		{
			self.clearTimeline();

			var animations = self.obj.animations;

			for(var i = 0; i < animations.length; i++)
			{
				var container = document.createElement("div");
				container.style.backgroundColor = "#FF0000";
				self.timeline.appendChild(container);

				var tracks = animations[i].tracks;
				for(var j = 0; j < tracks.length; j++)
				{
					var key = document.createElement("div");
					key.style.backgroundColor = MathUtils.randomColor();
					key.style.height = "100%";
					key.style.width = (self.scale * animations[i].duration) + "px";
					container.appendChild(key);
				}
			}
		}
	});

	this.play = new Button(this.bar);
	this.play.position.set(300, 0);
	this.play.size.set(100, 20);
	this.play.setText("Play")
	this.play.updateInterface();
	this.play.setCallback(function()
	{
		self.mixer = new AnimationMixer(self.obj);

		var action = self.mixer.clipAction(self.obj.animations[0]);
		action.setLoop(THREE.LoopPingPong); //LoopOnce || LoopRepeat || LoopPingPong
		action.play(); 

		var clock = new THREE.Clock();
		clock.start();

		var loop = function()
		{
			if(self.playing)
			{
				self.mixer.update(clock.getDelta());
				requestAnimationFrame(loop);
			}
		};

		self.playing = true;
		loop();
	});

	this.stop = new Button(this.bar);
	this.stop.position.set(400, 0);
	this.stop.size.set(100, 20);
	this.stop.setText("Stop")
	this.stop.updateInterface();
	this.stop.setCallback(function()
	{
		self.mixer.time = 0;
		self.mixer.update(0);
		self.mixer.stopAllAction();

		self.playing = false;
	});

	/*var mixer, clock;

	function initialize()
	{
		var box = scene.getObjectByName("box");
		
		var position = new VectorKeyframeTrack(".position", [0, 1, 2], [0,0,0, 0,10,0, 0,0,0]);
		var color = new ColorKeyframeTrack(".material.color", [0, 1, 3], [1,0,0, 0,1,0, 0,0,1]);
		
		var clip = new AnimationClip("Animation", 3, [position, color]);
		
		mixer = new AnimationMixer(box);
		mixer.clipAction(clip).play();
		
		clock = new Clock();
		clock.start();
	}

	function update()
	{
		mixer.update(clock.getDelta());
	}*/
}

AnimationTab.prototype = Object.create(TabElement.prototype);

//Clean timeline
AnimationTab.prototype.clearTimeline = function()
{
	this.element.removeChild(this.timeline);

	this.timeline = document.createElement("div");
	this.timeline.style.overflow = "auto";
	this.timeline.style.position = "absolute";
	this.timeline.style.top = "20px";
	this.timeline.style.width = "100%";
	this.element.appendChild(this.timeline);
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

