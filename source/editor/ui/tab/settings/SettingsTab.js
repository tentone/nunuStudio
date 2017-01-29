"use strict";

function SettingsTab(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Options tab container
	this.tab = new TabGroup(this.element);
	this.tab.element.style.cursor = "default";
	this.tab.element.style.backgroundColor = Editor.theme.bar_color;
	this.tab.button_size.set(200, 30);
	this.tab.mode = TabGroup.LEFT;
	this.tab.updateInterface();

	//General tab
	this.general = this.tab.addTab("General", "editor/files/icons/misc/tool.png", false);
	this.general.attachComponent(new GeneralSettingsTab(this.general.element));
	this.general.activate();
	this.general.updateInterface();
	

	//Code
	this.code = this.tab.addTab("Code", "editor/files/icons/script/script.png", false);
	this.code.attachComponent(new CodeSettingsTab(this.code.element));
	this.code.updateInterface();

	//About
	this.about = this.tab.addTab("About", "editor/files/icons/misc/about.png", false);
	this.about.attachComponent(new AboutTab(this.about.element));
	this.about.updateInterface();
	
	//Element atributes
	this.fit_parent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Update container object data
SettingsTab.prototype.updateMetadata = function(container){}

//Activate
SettingsTab.prototype.activate = function()
{
	Editor.setState(Editor.STATE_IDLE);
}

//Remove element
SettingsTab.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update SettingsTab
SettingsTab.prototype.update = function(){}

//Update division Size
SettingsTab.prototype.updateInterface = function()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
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
