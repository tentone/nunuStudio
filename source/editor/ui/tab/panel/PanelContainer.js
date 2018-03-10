"use strict";

function PanelContainer(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Object inspector", Editor.filePath + "icons/misc/magnifier.png");

	this.element.style.overflow = "auto";
	this.element.style.backgroundColor = Editor.theme.panelColor;
}

PanelContainer.prototype = Object.create(TabElement.prototype);

PanelContainer.prototype.attach = function(object)
{	
	//TODO <ATTACH AND CREATE PANELS>
};