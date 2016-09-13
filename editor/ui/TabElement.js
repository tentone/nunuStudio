"use strict";

function TabElement(parent, name, icon, closeable, container, index)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}

	//ID
	var id = "tab" + TabGroup.id;
	TabElement.id++;

	//Element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.cursor = "default";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panel_color;

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};
	
	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Meta
	this.closeable = closeable;
	this.name = name;
	this.icon = icon;

	//Button
	this.button = null;

	//Tab information
	this.index = index;
	this.container = container;
	this.component = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//ID counter
TabElement.id = 0;

//Close tab
TabElement.prototype.close = function()
{
	this.container.removeTab(this.index);
}

//Dectivate tab
TabElement.prototype.updateMetadata = function()
{
	if(this.component !== null)
	{
		this.component.updateMetadata(this);
	}
}

//Activate tab
TabElement.prototype.activate = function()
{
	if(this.component !== null && this.component.activate !== undefined)
	{
		this.component.activate();
	}
}

//Selects this tab
TabElement.prototype.select = function()
{
	this.container.selectTab(this.index);
}

//Check if tab is selected
TabElement.prototype.isSelected = function()
{
	return this.index === this.container.selected;
}

//Update
TabElement.prototype.update = function()
{
	if(this.component !== null)
	{
		this.component.update();
	}
}

//Destroy
TabElement.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
		this.button.destroy();
	}
	catch(e){}
}

//Set button icon
TabElement.prototype.setIcon = function(icon)
{
	this.icon = icon;
	this.button.icon.setImage(icon);
}

//Set button name
TabElement.prototype.setName = function(text)
{
	this.name = text;
	this.button.setName(text);
}


//Attach element to tab container
TabElement.prototype.attachComponent = function(component)
{
	this.component = component;

	if(this.component.parent !== this.element)
	{
		this.component.destroy();
		this.component.parent = this.element;
		this.element.appendChild(this.component.element);
	}
}

//Update Interface
TabElement.prototype.updateInterface = function()
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

	//Element
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";

	//Attached component
	if(this.component !== null)
	{
		this.component.visible = this.visible && this.container.visible;
		this.component.size.set(this.size.x, this.size.y);
		this.component.updateInterface();
	}
}
