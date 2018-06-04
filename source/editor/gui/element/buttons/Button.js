"use strict";

function Button(parent)
{
	Element.call(this, parent);

	this.element.style.cursor = "pointer";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	this.element.style.color = Editor.theme.textColor;
	
	//Span
	this.span = document.createElement("span");
	this.span.style.whiteSpace = "pre";
	this.element.appendChild(this.span);

	//Text
	this.text = document.createTextNode("");
	this.span.appendChild(this.text);

	this.preventDragEvents();

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
	this.text.data = text;
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