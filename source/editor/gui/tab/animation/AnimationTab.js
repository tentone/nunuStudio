"use strict";

/**
 * The animation tab is used to display and edit object animations timelines.
 *
 * Animations can be composed of multiple tracks. A object can have multiple animations.
 *
 * Each track is composed of keyframes that represent the states of the animation.
 *
 * @class AnimationTab
 * @extends {AnimationTab}
 * @param {Component} parent
 */
function AnimationTab(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, "Animation", Global.FILE_PATH + "icons/misc/animation.png");

	var self = this;

	this.mixer = null;
	this.object = null;
	this.clock = new THREE.Clock();
	
	this.zoom = 120.0; // Pixels/sec
	this.animations = [];

	/**
	 * Menu bar where the options to create animation clip, and play the animation controls are located.
	 *
	 * @attribute bar
	 * @type {Component}
	 */
	this.bar = new Component(this, "div");
	this.bar.size.set(0, 25);
	this.bar.element.style.position = "absolute";
	this.bar.element.style.height = "25px";
	this.bar.element.style.width = "100%";
	this.bar.element.style.backgroundColor = Editor.theme.barColor;

	/**
	 * Add animation clip button.
	 *
	 * @attribute add
	 * @type {ButtonText}
	 */
	this.add = new ButtonText(this.bar);
	this.add.position.set(0, 0);
	this.add.size.set(100, this.bar.size.y);
	this.add.setText(Locale.add)
	this.add.updateInterface();
	this.add.setOnClick(function()
	{
		if(self.object !== null)
		{
			if(self.object.animations === undefined)
			{
				self.object.animations = [];
			}

			var clip = new AnimationClip("Animation" + self.object.animations.length, 3, []);
			
			// Object 3D
			if(self.object.isObject3D)
			{
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
			}
			// Material
			else if(self.object.isMaterial)
			{
				if(self.object.color !== undefined)
				{
					console.log(self.object.color);

					var color = new THREE.ColorKeyframeTrack(".color", [0], [self.object.color]);
					color.setInterpolation(THREE.InterpolateLinear);
					color.setColor("#00FF00");
					clip.tracks.push(color);
				}

				var opacity = new THREE.NumberKeyframeTrack(".opacity", [0], [self.object.opacity]);
				opacity.setInterpolation(THREE.InterpolateLinear);
				opacity.setColor("#FF0000");
				clip.tracks.push(opacity);
			}

			self.object.animations.push(clip);
			self.attach(self.object);
		}
		else
		{
			Editor.alert(Locale.selectObjectEditAnimation);
		}
	});

	this.play = new ButtonText(this.bar);
	this.play.position.set(100, 0);
	this.play.size.set(100, this.bar.size.y);
	this.play.setText(Locale.play)
	this.play.updateInterface();
	this.play.setOnClick(function()
	{
		if(self.mixer == null)
		{
			Editor.alert("No animation found!");
			return;
		}

		if(self.mixer.playing)
		{
			self.mixer.pause();
			self.play.setText(Locale.play);
		}
		else
		{
			self.mixer.play();
			self.play.setText("Pause");
		}
	});

	this.stop = new ButtonText(this.bar);
	this.stop.position.set(200, 0);
	this.stop.size.set(100, this.bar.size.y);
	this.stop.setText("Stop");
	this.stop.updateInterface();
	this.stop.setOnClick(function()
	{
		if(self.mixer == null)
		{
			Editor.alert("No animation playing!");
			return;
		}

		self.play.setText(Locale.play);
		self.mixer.stop();
	});

	this.zoomSlider = new Slider(this.bar);
	this.zoomSlider.size.set(100, 15);
	this.zoomSlider.position.set(30, 0);
	this.zoomSlider.setStep(10);
	this.zoomSlider.setRange(20, 1000);
	this.zoomSlider.updatePosition(Component.TOP_RIGHT);
	this.zoomSlider.updateSize();
	this.zoomSlider.setValue(this.zoom);
	this.zoomSlider.setOnChange(function()
	{
		self.zoom = self.zoomSlider.getValue();
		self.createTimeline();
	});
	this.zoomSlider.text.style.right = "5px";

	this.zoomText = new Text(this.bar);
	this.zoomText.setText(Locale.zoom);
	this.zoomText.size.set(90, 15);
	this.zoomText.position.set(110, 0);
	this.zoomText.updatePosition(Component.TOP_RIGHT);
	this.zoomText.updateSize();

	/**
	 * Timeline division (movable tab) occupies the hole tab except for the options bar.
	 *
	 * Contains the info on the left and tracks on right side.
	 *
	 * @property timeline
	 * @type {Component}
	 */
	this.timeline = new Component(this, "div");
	this.timeline.element.style.overflowY = "auto";

	/**
	 * Information button tab.
	 *
	 * @property info
	 * @type {Division}
	 */
	this.info = new Division(this.timeline);
	this.info.element.style.backgroundColor = Editor.theme.barColor;

	/**
	 * Tracks section.
	 *
	 * @property info
	 * @type {Division}
	 */
	this.tracks = new Division(this.timeline);

	/**
	 * Text shown when there is no object selected to display animation timeline.
	 *
	 * @attribute emptyText
	 * @type {Text}
	 */
	this.emptyText = new Text(this);
	this.emptyText.allowWordBreak(true);
	this.emptyText.setTextSize(12);
	this.emptyText.setTextColor("#FFFFFF");
	this.emptyText.setText(Locale.selectObjectEditAnimation);

	// Temporary variables for mouse movement
	var mouse = 0, initial = 0;

	/**
	 * Resize tab placed between the info and tracks divisions
	 *
	 * @property tab
	 * @type {Component}
	 */
	this.tab = document.createElement("div");
	this.tab.style.backgroundColor = Editor.theme.barColor;
	this.tab.style.position = "absolute";
	this.tab.style.cursor = "e-resize";
	this.tab.style.width = "5px";
	this.tab.style.top = "0px";
	this.tab.style.height = "100%";
	this.tab.position = 250;
	this.timeline.element.appendChild(this.tab);

	this.tab.onmousedown = function(event)
	{
		mouse = event.clientX;
		initial = this.position;
		self.tabManager.create();
	};

	/** 
	 * Tab drag event manager.
	 *
	 * @property tabManager
	 * @type {EventManager}
	 */
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
}

AnimationTab.prototype = Object.create(TabComponent.prototype);

AnimationTab.prototype.attach = function(object)
{
	this.object = object;

	if(this.object !== null)
	{
		this.createAnimationMixer();
		this.createTimeline();
	}
	else
	{
		this.clearAnimationMixer();
		this.clearTimeline();
	}

	this.emptyText.setVisibility(this.object === null);
};

AnimationTab.prototype.activate = function()
{
	TabComponent.prototype.activate.call(this);

	this.updateSelection();
};

AnimationTab.prototype.deactivate = function()
{
	TabComponent.prototype.deactivate.call(this);

	if(this.mixer !== null && this.mixer.playing)
	{
		this.play.setText(Locale.play);
		this.mixer.stop();
	}
};

AnimationTab.prototype.updateSelection = function()
{
	this.attach(Editor.selection.length > 0 ? Editor.selection[0] : null);
};

/**
 * Clear animation mixer object.
 *
 * @method clearAnimationMixer
 */
AnimationTab.prototype.clearAnimationMixer = function(keepTime)
{
	if(this.mixer !== null)
	{
		this.play.setText(Locale.play);
		this.mixer.stop();
		this.mixer.dispose();
		this.mixer = null;
	}
};

/**
 * Create a new animation mixer for the attached object.
 *
 * Destroy the old animation mixed and recreate a new one.
 *
 * @method createAnimationMixer
 */
AnimationTab.prototype.createAnimationMixer = function(keepTime)
{
	var time = 0;

	// Remove old mixer
	if(this.mixer !== null)
	{
		if(keepTime)
		{
			time = this.mixer.time;
		}

		this.clearAnimationMixer();
	}

	// Check if the object has animations
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

		// Update object panel when playing
		if(this.mixer.playing)
		{
			Editor.gui.inspector.updateValues();
		}
	}
};

/**
 * Clear timeline GUI elements.
 *
 * @method clearTimeline
 */
AnimationTab.prototype.clearTimeline = function()
{
	this.tracks.removeAllChildren();
	this.info.removeAllChildren();
};

/**
 * Create new timeline GUI elements remove the old ones from the tab.
 *
 * @method createTimeline
 */
AnimationTab.prototype.createTimeline = function()
{
	this.clearTimeline();
	this.animations = [];

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

/**
 * Add a new keyframe to a specific track with a specific value.
 *
 * @method addKeyframe
 * @param {Object} track
 * @param {Object} value
 */
AnimationTab.prototype.addKeyFrame = function(track, value)
{
	var attributes = track.name.split(".");

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

	// Check if there is already a keyframe with same time
	for(var i = 0; i < track.times.length; i++)
	{
		if(track.times[i] === this.mixer.time)
		{
			break;
		}
	}

	// If there is already a keyframe with time update values
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
	// Add new keyframe to track
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
		// Timeline
		this.timeline.position.set(0, this.bar.size.y);
		this.timeline.size.set(this.size.x, this.size.y - this.bar.size.y);
		this.timeline.updateInterface();

		// Tab
		this.tab.style.left = this.tab.position + "px";

		// Information
		this.info.size.set(this.tab.position, this.size.y - this.bar.size.y);
		this.info.updateInterface();
		
		// Tracks
		this.tracks.position.set(this.tab.position + 5, 0);
		this.tracks.size.set(this.size.x - this.tracks.position.x, this.size.y - this.bar.size.y);
		this.tracks.updateInterface();
		
		// Empty text
		this.emptyText.position.set(0, 0);
		this.emptyText.size.set(this.size.x, this.size.y);
		this.emptyText.updateInterface();

		// Element
		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
