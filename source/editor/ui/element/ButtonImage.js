"use strict";

function ButtonImage(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;
	
	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";

	//Image
	this.icon = document.createElement("img");
	this.icon.style.pointerEvents = "none";
	this.icon.style.position = "absolute";
	this.icon.style.top = "15%";
	this.icon.style.left = "15%";
	this.icon.style.width = "70%";
	this.icon.style.height = "70%";
	this.element.appendChild(this.icon);

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Image scale
	this.imageScale = new THREE.Vector2(0.7, 0.7);

	//Mouse over event
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = "";
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//Remove element
ButtonImage.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Set button callback function
ButtonImage.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
};

//Set image
ButtonImage.prototype.setImage = function(image)
{
	this.icon.src = image;
};

//Set image scale
ButtonImage.prototype.setImageScale = function(x, y)
{
	this.imageScale.set(x, y);
	
	this.icon.style.top = (1 - y) / 2;
	this.icon.style.left = (1 - x) / 2;
	this.icon.style.width = x;
	this.icon.style.height = y;
};

//Set alt text
ButtonImage.prototype.setAltText = function(altText)
{
	var text = new Text();
	text.element.style.background = Editor.theme.barColor;
	text.element.style.zIndex = "1000";
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
ButtonImage.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";

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