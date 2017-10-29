"use strict";

function Canvas(parent)
{
	Element.call(this, parent, "canvas");

	this.preventDragEvents();
}

Canvas.prototype = Object.create(Element.prototype);
