"use strict";

function SettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, Locale.settings, Editor.filePath + "icons/misc/settings.png");

	this.tab = new TabGroup(this, TabGroup.LEFT);
	this.tab.element.style.backgroundColor = Editor.theme.barColor;
	this.tab.buttonSize.set(200, 25);

	this.tab.addTab(GeneralSettingsTab, false).activate();
	this.tab.addTab(EditorSettingsTab, false);
	this.tab.addTab(RenderSettingsTab, false);
	this.tab.addTab(CodeSettingsTab, false);
	this.tab.addTab(JSHintSettingsTab, false);
}

SettingsTab.prototype = Object.create(TabElement.prototype);

SettingsTab.prototype.updateSize = function()
{
	TabElement.prototype.updateSize.call(this);

	this.tab.size.copy(this.size);
	this.tab.updateInterface();
};
