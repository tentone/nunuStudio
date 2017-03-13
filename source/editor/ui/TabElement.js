"use strict";

function TabElement(parent, closeable, container, index, title, icon)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "default";
	this.element.style.overflow = "hidden";
	this.element.style.backgroundColor = Editor.theme.panelColor;

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
	this.title = title;
	this.icon = icon;

	//Button
	this.button = null;

	//Container
	this.active = false;
	this.updating = false;
	this.index = index;
	this.container = container;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Update tab metadata
TabElement.prototype.updateMetadata = function(){};

//Activate tab
TabElement.prototype.activate = function()
{
	this.active = true;

	if(this.update !== undefined && !this.updating)
	{
		var self = this;

		var update = function()
		{
			self.update();

			if(self.active)
			{
				requestAnimationFrame(update);
			}
			else
			{
				self.updating = false;
			}
		};

		update();
		this.updating = true;
	}
};

//Deactivate tab
TabElement.prototype.deactivate = function()
{
	this.active = false;
};

//Attach object to tab
TabElement.prototype.attach = function(obj){};

//Check if object is attached to tab
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
	try
	{
		this.parent.removeChild(this.element);
		this.button.destroy();
	}
	catch(e){}
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
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";

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
