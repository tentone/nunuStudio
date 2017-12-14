"use strict";

function AnimationTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Animation", Editor.filePath + "icons/misc/animation.png");

	//Bar
	this.bar = document.createElement("div");
	this.bar.style.backgroundColor = Editor.theme.barColor;
	this.bar.style.overflow = "visible";
	this.bar.style.position = "absolute";
	this.bar.style.width = "100%";
	this.bar.style.height = "20px";
	this.element.appendChild(this.bar);

	//Dual division
	this.dual = new DualDivisionResizable(this.element);
	this.dual.tabPosition = 0.15;
	this.dual.tabPositionMax = 0.4;
	this.dual.tabPositionMin = 0.02;

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

		this.dual.size.set(this.size.x, this.size.y - 20);
		this.dual.position.set(0, 20);
		this.dual.updateInterface();
	}
	else
	{
		this.element.style.display = "none";
	}
};

