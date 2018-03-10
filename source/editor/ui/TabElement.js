"use strict";

function TabElement(parent, closeable, container, index, title, icon)
{
	Element.call(this, parent);

	this.element.style.overflow = "visible";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	this.preventDragEvents();

	//Meta
	this.closeable = closeable;
	this.title = title;
	this.icon = icon;

	//Button
	this.button = null;

	//Container
	this.uuid = THREE.Math.generateUUID();
	this.active = false;
	this.updating = false;
	this.index = index;
	this.container = container;
}

TabElement.prototype = Object.create(Element.prototype);

//Update tab metadata (called after applying changes to object)
TabElement.prototype.updateMetadata = Element.EMPTY;

//Activate tab (called when the tab is activated)
TabElement.prototype.activate = function()
{
	if(this.update !== undefined)
	{
		var self = this;

		var update = function()
		{
			self.update();

			if(self.active)
			{
				requestAnimationFrame(update);
			}
		};

		requestAnimationFrame(update);
	}

	this.active = true;
};

//Deactivate tab (called after the tab is deactivated or closed)
TabElement.prototype.deactivate = function()
{
	this.active = false;
};

//Attach object or resource to tab (used to attach objects to tab elements)
TabElement.prototype.attach = function(obj){};

//Update tab settings (called after settings of the editor are changed)
TabElement.prototype.updateSettings = Element.EMPTY;

//Check if an object or resource is attached to the tab (used to validated tabs after object removed)
TabElement.prototype.isAttached = function(obj)
{
	return false;
};

//Close tab
TabElement.prototype.close = function()
{
	this.container.removeTab(this);
};

//Selects this tab
TabElement.prototype.select = function()
{
	this.container.selectTab(this);
};

//Check if tab is selected
TabElement.prototype.isSelected = function()
{
	return this === this.container.selected;
};

//Destroy
TabElement.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
	
	this.button.destroy();
};

//Set button icon
TabElement.prototype.setIcon = function(icon)
{
	this.icon = icon;
	this.button.setIcon(icon);
};

//Set button title
TabElement.prototype.setName = function(text)
{
	this.title = text;
	this.button.setName(text);
};


//Update Interface
TabElement.prototype.updateInterface = function()
{
	if(this.visible)
	{
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
