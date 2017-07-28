"use strict";

function SettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Settings", Editor.filePath + "icons/misc/settings.png");

	//Tab Group
	this.tab = new TabGroup(this.element);
	this.tab.element.style.backgroundColor = Editor.theme.barColor;
	this.tab.buttonSize.set(200, 25);
	this.tab.mode = TabGroup.LEFT;

	//General
	this.general = this.tab.addTab(GeneralSettingsTab, false);
	this.general.activate();
	
	//Rendering
	this.rendering = this.tab.addTab(RenderSettingsTab, false);

	//Code
	this.code = this.tab.addTab(CodeSettingsTab, false);

	//JS Hint
	this.jshint = this.tab.addTab(JSHintSettingsTab, false);
}

SettingsTab.prototype = Object.create(TabElement.prototype);

//Update division Size
SettingsTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

		//Tab
		this.tab.visible = this.visible;
		this.tab.size.copy(this.size);
		this.tab.updateInterface();

		//Element
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
