"use strict";

function SettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Settings", "editor/files/icons/misc/settings.png");

	//Options tab container
	this.tab = new TabGroup(this.element);
	this.tab.element.style.backgroundColor = Editor.theme.barColor;
	this.tab.buttonSize.set(200, 30);
	this.tab.mode = TabGroup.LEFT;
	this.tab.updateInterface();

	//General tab
	this.general = this.tab.addTab(GeneralSettingsTab, false);
	this.general.activate();
	this.general.updateInterface();
	
	//Code
	this.code = this.tab.addTab(CodeSettingsTab, false);
	this.code.updateInterface();

	//About
	this.about = this.tab.addTab(AboutTab, false);
	this.about.updateInterface();
}

SettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
SettingsTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);
}

//Update division Size
SettingsTab.prototype.updateInterface = function()
{
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update tab
	this.tab.visible = this.visible;
	this.tab.size.copy(this.size);
	this.tab.updateInterface();

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
