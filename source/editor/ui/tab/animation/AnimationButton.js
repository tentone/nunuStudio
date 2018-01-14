"use strict";

function AnimationButton(parent, editor, animation)
{
	Element.call(this, parent);

	this.element.style.position = "absolute";

	this.editor = editor;
	this.animation = animation;

	var self = this;

	this.element.oncontextmenu = function(event)
	{
		var animation = self.animation;
		var object = self.editor.object;

		var context = new ContextMenu();
		context.size.set(150, 20);
		context.position.set(event.clientX, event.clientY);
		context.addOption("Rename", function()
		{
			var value = prompt("Rename animation", animation.name);
			if(value !== null && value !== "")
			{
				Editor.history.add(new ChangeAction(animation, "name", value));
				self.updateAnimation();
			}
		});
		/*context.addOption("Add track", function()
		{
			var attribute = prompt("Attribute");
			var value = object[attribute];

			console.log(value);

			//TODO <ADD CODE HERE>
		});*/
		context.addOption("Delete", function()
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
				alert("Unable to delete animation");
			}

			self.editor.createTimeline();
			self.editor.createAnimationMixer();
		});
		context.updateInterface();
	};

	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = Editor.theme.buttonColor;
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

AnimationButton.prototype = Object.create(Element.prototype);

AnimationButton.prototype.updateAnimation = function()
{
	this.name.innerHTML = this.animation.name;
};

AnimationButton.prototype.updateInterface = function()
{
	this.element.style.left = this.position.x + "px";
	this.element.style.top = this.position.y + "px";
	this.element.style.height = this.size.y + "px";
	this.element.style.width = "100%";
};