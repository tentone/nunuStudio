"use strict";

function Canvas(parent)
{
	Element.call(this, parent, "canvas");

	this.preventDragEvents();
}

Canvas.prototype = Object.create(Element.prototype);

Canvas.prototype.setResolution = function(width, height)
{
	this.element.width = width;
	this.element.height = height;
};

Canvas.prototype.getContext2D = function()
{
	return this.element.getContext("2d");
};
