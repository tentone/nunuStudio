"use strict";

function ProjectSettings(parent, closeable, container, index)
{
	TabComponent.call(this, parent, closeable, container, index, Locale.settings, Global.FILE_PATH + "icons/misc/settings.png");

	this.tab = new TabGroup(this, TabGroup.LEFT);
	this.tab.element.style.backgroundColor = "var(--bar-color)";
	this.tab.buttonSize.set(200, 25);
}

ProjectSettings.prototype = Object.create(TabComponent.prototype);

ProjectSettings.prototype.updateSize = function()
{
	TabComponent.prototype.updateSize.call(this);

	this.tab.size.copy(this.size);
	this.tab.updateInterface();
};
