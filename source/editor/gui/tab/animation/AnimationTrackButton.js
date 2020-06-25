import {Key} from "../../../../core/input/Key.js";
import {AnimationMixer} from "../../../../core/animation/AnimationMixer.js";
import {AnimationTrack} from "./AnimationTrack.js";
import {Interface} from "../../Interface.js";
import {Global} from "../../../Global.js";
import {Editor} from "../../../Editor.js";
import {Text} from "../../../components/Text.js";
import {DropdownList} from "../../../components/input/DropdownList.js";
import {ColorChooser} from "../../../components/input/ColorChooser.js";
import {ContextMenu} from "../../../components/dropdown/ContextMenu.js";
import {DocumentBody} from "../../../components/DocumentBody.js";
import {Component} from "../../../components/Component.js";
import {Button} from "../../../components/buttons/Button.js";
import {InterpolateLinear, Smooth, InterpolateDiscrete} from "three";

/**
 * Button displyed on the left side that shows the attribute track being edited.
 *
 * @class AnimationTrackButton
 * @extends {Component}
 */
function AnimationTrackButton(parent, editor, animation, track, trackTimeline)
{
	Component.call(this, parent, "div");

	this.element.style.position = "relative";
	this.element.style.backgroundColor = "var(--bar-color)";
	this.element.style.width = "100%";
	this.element.style.height = "30px";

	this.editor = editor;
	this.animation = animation;
	this.track = track;
	this.trackTimeline = trackTimeline;

	var self = this;

	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = "var(--button-over-color)";
	};

	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = "var(--bar-color)";
	};

	this.element.oncontextmenu = function(event)
	{
		var track = self.track;
		var animation = self.animation;

		var context = new ContextMenu(DocumentBody);
		context.size.set(150, 20);
		context.position.set(event.clientX, event.clientY);
		
		context.addOption("Add Keyframe", function()
		{
			self.editor.addKeyFrame(track, self.editor.object);
			self.editor.createAnimationMixer(true);
			self.trackTimeline.updateKeyframes();
		});

		context.addOption(Locale.delete, function()
		{
			if(!Editor.confirm("Delete track?"))
			{
				return;
			}

			var index = animation.tracks.indexOf(track);
			if(index !== -1)
			{
				animation.tracks.splice(index, 1);
			}
			else
			{
				Editor.alert("Unable to delete track");
			}

			self.editor.createTimeline();
			self.editor.createAnimationMixer();
		});

		context.addOption("Optimize", function()
		{
			track.optimize();

			Editor.alert("Track optimized");

			self.trackTimeline.updateKeyframes();
			self.editor.createAnimationMixer();
		});

		context.addOption("Shift", function()
		{
			var time = Number.parseFloat(Editor.prompt("Time to shift track"));

			if(isNaN(time))
			{
				Editor.alert("Invalid time value");
				return;
			}

			track.shift(time);

			self.trackTimeline.updateKeyframes();
			self.editor.createAnimationMixer();
		});
		
		context.addOption("Trim", function()
		{
			var start = Number.parseFloat(Editor.prompt("Start time"));
			var end = Number.parseFloat(Editor.prompt("End time"));

			if(isNaN(start) || isNaN(end))
			{
				Editor.alert("Invalid time value");
				return;
			}

			track.trim(start, time);

			self.trackTimeline.updateKeyframes();
			self.editor.createAnimationMixer();
		});

		context.updateInterface();
	};

	this.name = document.createElement("div");
	this.name.style.position = "absolute";
	this.name.style.textOverflow = "ellipsis";
	this.name.style.whiteSpace = "nowrap";
	this.name.style.overflow = "hidden";
	this.name.style.top = "25%";
	this.name.style.width = "100%";
	this.name.style.pointerEvents = "none";
	this.element.appendChild(this.name);

	var keyframe = document.createElement("img");
	keyframe.style.position = "absolute";
	keyframe.style.right = "4px";
	keyframe.style.top = "7px";
	keyframe.style.width = "12px";
	keyframe.style.height = "12px";
	keyframe.style.cursor = "pointer";
	keyframe.src = Global.FILE_PATH + "icons/misc/add.png";
	keyframe.onclick = function()
	{
		self.editor.addKeyFrame(self.track, self.editor.object);
		self.editor.createAnimationMixer(true);
		self.trackTimeline.updateKeyframes();
	};
	this.element.appendChild(keyframe);

	this.interpolation = new DropdownList(this);
	this.interpolation.size.set(30, 18);
	this.interpolation.position.set(22, 5);
	this.interpolation.updatePosition(Component.TOP_RIGHT);
	this.interpolation.updateSize();
	this.interpolation.addValue(Locale.linear, InterpolateLinear);
	this.interpolation.addValue(Locale.smooth, Smooth);
	this.interpolation.addValue("Discrete", InterpolateDiscrete);
	this.interpolation.setOnChange(function()
	{
		self.track.setInterpolation(self.interpolation.getValue());
		self.editor.createAnimationMixer();
	});

	this.color = new ColorChooser(this);
	this.color.size.set(20, 18);
	this.color.position.set(57, 5);
	this.color.updatePosition(Component.TOP_RIGHT);
	this.color.updateSize();
	this.color.setOnChange(function()
	{
		self.track.color = self.color.getValueString();
		self.trackTimeline.updateKeyframes();
	});

	this.updateTrack();
}

AnimationTrackButton.prototype = Object.create(Component.prototype);

AnimationTrackButton.prototype.updateTrack = function()
{
	this.name.appendChild(document.createTextNode(this.track.name));
	this.color.setValueString(this.track.color);
	this.interpolation.setValue(this.track.getInterpolation());
};

AnimationTrackButton.prototype.updateInterface = function()
{};
export {AnimationTrackButton};