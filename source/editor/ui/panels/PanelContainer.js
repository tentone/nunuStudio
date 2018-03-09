"use strict";

function PanelContainer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Object explorer", Editor.filePath + "icons/misc/menu.png");

	this.element.style.overflow = "auto";
	this.element.style.pointerEvents = "none";
	this.element.style.backgroundColor = Editor.theme.panelColor;
}

PanelContainer.prototype = Object.create(TabElement.prototype);

PanelContainer.prototype.attach = function(object)
{	
	//TODO <ATTACH AND CREATE PANELS>
};