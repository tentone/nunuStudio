"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Animation", Editor.filePath + "icons/misc/animation.png");

	var self = this;

 	this.obj = null;
 	
 	//Scale in pixels per second
 	this.scale = 20.0;
 	
 	//Playback
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

	//Create animation
	this.button = new Button(this.bar);
	this.button.position.set(0, 0);
	this.button.size.set(100, 20);
	this.button.setText("Create animation")
	this.button.updateInterface();
	this.button.setCallback(function()
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

	//Update
	this.updateButton = new Button(this.bar);
	this.updateButton.position.set(100, 0);
	this.updateButton.size.set(100, 20);
	this.updateButton.setText("Update")
	this.updateButton.updateInterface();
	this.updateButton.setCallback(function()
	{
		if(self.obj !== null)
		{
			//self.clearTimeline();

			var animations = self.obj.animations;

			for(var i = 0; i < animations.length; i++)
			{
				var container = document.createElement("div");
				container.style.backgroundColor = "#FF0000";
				container.style.height = "20px";
				container.style.width = "100px";
				self.timeline.appendChild(container);

			}
		}
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

