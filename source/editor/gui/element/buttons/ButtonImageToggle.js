"use strict";

function ButtonImageToggle(parent)
{
	Element.call(this, parent);

	this.element.style.cursor = "pointer";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	
	this.preventDragEvents();

	//Image
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.style.pointerEvents = "none";
	this.icon.style.top = "15%";
	this.icon.style.left = "15%";
	this.icon.style.width = "70%";
	this.icon.style.height = "70%";
	this.element.appendChild(this.icon);
	
	//Image
	this.selected = false;
	this.imageScale = new THREE.Vector2(0.7, 0.7);

	//Click event
	var self = this;
	this.element.onclick = function()
	{
		self.selected = !self.selected;
	};

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		if(!self.selected)
		{
			self.element.style.backgroundColor = Editor.theme.buttonColor;
		}
	};
}

ButtonImageToggle.prototype = Object.create(Element.prototype);

//Set button callback function
ButtonImageToggle.prototype.setCallback = function(callback)
{
	var self = this;
	this.element.onclick = function()
	{
		self.selected = !self.selected;
		callback();	
	};
};

//Set image
ButtonImageToggle.prototype.setImage = function(image)
{
	this.icon.src = image;
};

//Set image scale
ButtonImageToggle.prototype.setImageScale = function(x, y)
{
	this.imageScale.set(x, y);
	
	this.icon.style.top = (1 - y) / 2;
	this.icon.style.left = (1 - x) / 2;
	this.icon.style.width = x;
	this.icon.style.height = y;
};

ButtonImageToggle.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.element.style.backgroundColor = this.selected ? Editor.theme.buttonOverColor : Editor.theme.buttonColor;
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};