"use strict";

function ButtonMenu(parent)
{
	Button.call(this, parent);

	this.element.style.cursor = "pointer";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	
	//Text
	this.text = new Text(this.element);

	//Icon
	this.icon = null;

	this.preventDragEvents();

	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = Editor.theme.buttonColor;
	};
}

ButtonMenu.prototype = Object.create(Element.prototype);

//Set button icon image URL
ButtonMenu.prototype.setIcon = function(icon)
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

//Set Button text
ButtonMenu.prototype.setText = function(text)
{
	this.text.setText(text);
};

//Set button callback function
ButtonMenu.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
};

//Update Button Size
ButtonMenu.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.text.size.set(this.size.x, this.size.y);
		this.text.updateInterface();
 
		this.element.style.display = "flex";
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