"use strict";

function ProjectSettings(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Settings", Editor.filePath + "icons/misc/settings.png");

	this.tab = new TabGroup(this);
	this.tab.element.style.backgroundColor = Editor.theme.barColor;
	this.tab.buttonSize.set(200, 25);
	this.tab.placement = TabGroup.LEFT;
}

ProjectSettings.prototype = Object.create(TabElement.prototype);

ProjectSettings.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.tab.size.copy(this.size);
	this.tab.updateInterface();
};
