"use strict";

function SideBar(parent)
{
	Element.call(this, parent, "div");

	this.preventDragEvents();

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.barColor;

	this.toolBar = new ToolBar(this, parent, 40, 5);
	
	SideBarObject(this, 40, 190);
}

SideBar.prototype = Object.create(Element.prototype);
