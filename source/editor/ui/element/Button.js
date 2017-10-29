"use strict";

function Button(parent)
{
	Element.call(this, parent);

	this.element.style.cursor = "pointer";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.buttonColor;

	this.preventDragEvents();

	this.icon = null;

	//Text
	this.text = new Text(this.element);

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = Editor.theme.buttonColor;
	};
}

Button.prototype = Object.create(Element.prototype);

//Set Button text
Button.prototype.setText = function(text)
{
	this.text.setText(text);
};

//Set button icon
Button.prototype.setIcon = function(icon)
{
	if(this.icon === null)
	{
		this.icon = document.createElement("img");
		this.icon.style.position = "absolute";
		this.icon.style.display = "block";
		this.icon.style.left = "5px";
		this.icon.style.top = "3px";
		this.icon.style.width = "12px";
		this.icon.style.height = "12px";
		this.element.appendChild(this.icon);
	}
	
	this.icon.src = icon;
};

//Set button callback function
Button.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
};

//Update Button Size
Button.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	
		this.text.size.set(this.size.x, this.size.y);
		this.text.visible = this.visible;
		this.text.updateInterface();

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