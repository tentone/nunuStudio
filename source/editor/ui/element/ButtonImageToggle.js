"use strict";

function ButtonImageToggle(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	
	//Prevent drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent drag over event
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Image
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.style.pointerEvents = "none";
	this.icon.style.top = "15%";
	this.icon.style.left = "15%";
	this.icon.style.width = "70%";
	this.icon.style.height = "70%";
	this.element.appendChild(this.icon);

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

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

	//Add element to document
	this.parent.appendChild(this.element);
}

//Remove element
ButtonImageToggle.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

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

//Set alt text
ButtonImageToggle.prototype.setAltText = function(altText)
{
	var text = new Text();
	text.element.style.backgroundColor = Editor.theme.barColor;
	text.element.style.zIndex = "1000";
	text.element.style.border = "3px solid";
	text.element.style.borderRadius = "5px";
	text.element.style.borderColor = Editor.theme.barColor;
	text.setText(altText);
	text.visible = false;
	text.fitContent = true;
	text.updateInterface();

	//Mouse mouse move event
	this.element.onmousemove = function(event)
	{
		text.size.set(0, 20);
		text.position.set(event.clientX - text.size.x/2, event.clientY - 30);
		text.visible = true;
		text.updateInterface();
	};

	//Mouse out event (to avoid overlap with mouse leave event)
	this.element.onmouseout = function()
	{
		text.visible = false;
		text.updateInterface();
	}
};

//Update Interface
ButtonImageToggle.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		
		//Selected
		if(this.selected)
		{
			this.element.style.backgroundColor = Editor.theme.buttonOverColor;
		}
		else
		{
			this.element.style.backgroundColor = Editor.theme.buttonColor;
		}

		//Element
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