"use strict";

function SettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Settings", Editor.filePath + "icons/misc/settings.png");

	this.tab = new TabGroup(this);
	this.tab.element.style.backgroundColor = Editor.theme.barColor;
	this.tab.buttonSize.set(200, 25);
	this.tab.mode = TabGroup.LEFT;

	this.tab.addTab(GeneralSettingsTab, false).activate();
	this.tab.addTab(EditorSettingsTab, false);
	this.tab.addTab(RenderSettingsTab, false);
	this.tab.addTab(CodeSettingsTab, false);
	this.tab.addTab(JSHintSettingsTab, false);
}

SettingsTab.prototype = Object.create(TabElement.prototype);

//Update division Size
SettingsTab.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.tab.visible = this.visible;
		this.tab.size.copy(this.size);
		this.tab.updateInterface();

		this.element.style.display = "block";
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.display = "none";
	}
};
