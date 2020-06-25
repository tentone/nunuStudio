"use strict";

/**
 * Button displyed on the left side that contains the name of the animation track.
 *
 * Each animation has multiple attribute tracks.
 *
 * @class AnimationClipButton
 * @extends {Component}
 */
function AnimationClipButton(parent, editor, animation)
{
	Component.call(this, parent, "div");

	this.element.style.position = "relative";
	this.element.style.width = "100%";
	this.element.style.height = "30px";

	this.editor = editor;
	this.animation = animation;

	var self = this;

	this.element.oncontextmenu = function(event)
	{
		var animation = self.animation;
		var object = self.editor.object;

		var context = new ContextMenu(DocumentBody);
		context.size.set(150, 20);
		context.position.set(event.clientX, event.clientY);
		context.addOption(Locale.rename, function()
		{
			var value = Editor.prompt("Rename animation", animation.name);
			if(value !== null && value !== "")
			{
				Editor.addAction(new ChangeAction(animation, "name", value));
				self.updateAnimation();
			}
		});
		context.addOption("Add track", function()
		{
			var attribute = Editor.prompt("Attribute");
			if(!attribute.startsWith("."))
			{
				attribute = "." + attribute;
			}

			var attributes = attribute.split(".");
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

			if(value === object)
			{
				Editor.alert("Attribute not found");
			}

			if(value.isVector3)
			{
				var track = new THREE.VectorKeyframeTrack(attribute, [0], value.toArray());
				track.setInterpolation(THREE.InterpolateLinear);
			}
			else if(value instanceof THREE.Color)
			{
				var track = new THREE.ColorKeyframeTrack(attribute, [0], value.toArray());
				track.setInterpolation(THREE.InterpolateLinear);
			}
			else if(value.isQuaternion)
			{
				var track = new THREE.QuaternionKeyframeTrack(attribute, [0], value.toArray());
				track.setInterpolation(THREE.InterpolateLinear);
			}
			else if(typeof value === "string")
			{
				var track = new THREE.StringKeyframeTrack(attribute, [0], [value]);
				track.setInterpolation(THREE.InterpolateDiscrete);
			}
			else if(typeof value === "boolean")
			{
				var track = new THREE.BooleanKeyframeTrack(attribute, [0], [value]);
				track.setInterpolation(THREE.InterpolateDiscrete);
			}
			else if(typeof value === "number")
			{
				var track = new THREE.NumberKeyframeTrack(attribute, [0], [value]);
				track.setInterpolation(THREE.InterpolateLinear);
			}
			else
			{
				console.warn("nunuStudio: Attribute it no animable", value);
				Editor.alert("Attribute is not animable");
				return;
			}

			track.setColor(MathUtils.randomColor());
			animation.tracks.push(track);
			self.editor.createTimeline();
			self.editor.createAnimationMixer();
		});
		context.addOption(Locale.delete, function()
		{
			if(!Editor.confirm("Delete animation?"))
			{
				return;
			}

			var index = object.animations.indexOf(animation);
			if(index !== -1)
			{
				object.animations.splice(index, 1);
			}
			else
			{
				Editor.alert("Unable to delete animation");
			}

			self.editor.createTimeline();
			self.editor.createAnimationMixer();
		});
		context.updateInterface();
	};

	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = "var(--button-over-color)";
	};

	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = "var(--bar-color)";
	};
	
	this.name = document.createElement("div");
	this.name.style.position = "absolute";
	this.name.style.textOverflow = "ellipsis";
	this.name.style.whiteSpace = "nowrap";
	this.name.style.overflow = "hidden";
	this.name.style.top = "25%";
	this.name.style.pointerEvents = "none";
	this.element.appendChild(this.name);

	this.updateAnimation();
}

AnimationClipButton.prototype = Object.create(Component.prototype);

AnimationClipButton.prototype.updateAnimation = function()
{
	this.name.appendChild(document.createTextNode(this.animation.name));
};

AnimationClipButton.prototype.updateInterface = function(){};