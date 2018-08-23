"use strict";

function Bar(parent)
{
	Element.call(this, parent, "div");

	this.preventDragEvents();

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.barColor;
}

Bar.prototype = Object.create(Element.prototype);
