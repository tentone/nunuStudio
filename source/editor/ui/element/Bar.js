"use strict";

function Bar(parent)
{
	Element.call(this, parent);

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.barColor;

	this.preventDragEvents();
}

Bar.prototype = Object.create(Element.prototype);
