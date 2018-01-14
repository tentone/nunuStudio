"use strict";

function AnimationOptions(parent, editor, animation)
{
	Element.call(this, parent);

	this.element.style.position = "absolute";

	this.editor = editor;
	this.animation = animation;

	var self = this;

	//TODO <ADD CODE HERE>
}

AnimationOptions.prototype = Object.create(Element.prototype);

AnimationOptions.prototype.updateAnimation = function()
{
	//TODO <ADD CODE HERE>
};

AnimationOptions.prototype.updateInterface = function()
{
	this.element.style.left = this.position.x + "px";
	this.element.style.top = this.position.y + "px";
	this.element.style.height = this.size.y + "px";
	this.element.style.width = "100%";
};