"use strict";

function SettingsTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Settings", "editor/files/icons/misc/settings.png");

	//Tab container
	this.tab = new TabGroup(this.element);
	this.tab.element.style.backgroundColor = Editor.theme.barColor;
	this.tab.buttonSize.set(200, 30);
	this.tab.mode = TabGroup.LEFT;

	//General tab
	this.general = this.tab.addTab(GeneralSettingsTab, false);
	this.general.activate();
	
	//Code
	this.code = this.tab.addTab(CodeSettingsTab, false);

	//About
	this.about = this.tab.addTab(AboutTab, false);
}

SettingsTab.prototype = Object.create(TabElement.prototype);

//Activate
SettingsTab.prototype.activate = function()
{
	this.active = true;
	
	Editor.setState(Editor.STATE_IDLE);
}

//Update division Size
SettingsTab.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

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
	else
	{
		this.element.style.display = "none";
	}


}
