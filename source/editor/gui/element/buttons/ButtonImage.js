"use strict";

function ButtonImage(parent)
{
	Element.call(this, parent);

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

	//Mouse over event
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = null;
	};
}

ButtonImage.prototype = Object.create(Element.prototype);

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
	this.icon.style.top = ((1 - y) / 2 * 100) + "%";
	this.icon.style.left = ((1 - x) / 2 * 100) + "%";
	this.icon.style.width = (x * 100) + "%";
	this.icon.style.height = (y * 100) + "%";
};

//Update Interface
ButtonImage.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
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