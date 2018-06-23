"use strict";

function Text(parent)
{
	Element.call(this, parent);

	this.element.style.display = "flex";
	this.element.style.alignItems = "center";
	this.element.style.pointerEvents = "none";
	this.element.style.color = Editor.theme.textColor;
	
	//Span
	this.span = document.createElement("span");
	this.span.style.whiteSpace = "pre";
	this.element.appendChild(this.span);

	//Text
	this.text = document.createTextNode("text");
	this.span.appendChild(this.text);

	this.setAlignment(Text.CENTER);

	//Attributes
	this.fitContent = false;
}

//Alignment
Text.CENTER = 0;
Text.LEFT = 1;
Text.RIGHT = 2;

//Overflow
Text.CLIP = 10;
Text.ELLIPSIS = 11;

Text.prototype = Object.create(Element.prototype);

//Set Text
Text.prototype.setText = function(text)
{
	this.text.data = text;
};

//Set Text Size
Text.prototype.setTextSize = function(size)
{
	this.element.style.fontSize = size + "px";
};

//Set Text Color
Text.prototype.setTextColor = function(color)
{
	this.element.style.color = color;
};

//Set overflow handling
Text.prototype.setOverflow = function(overflow)
{
	if(overflow === Text.ELLIPSIS)
	{
		this.span.style.textOverflow = "ellipsis";
	}
	else
	{
		this.span.style.textOverflow = "clip";
	}
};

//Set text alignment
Text.prototype.setAlignment = function(align)
{
	if(align === Text.CENTER)
	{
		this.element.style.justifyContent = "center";
		this.element.style.textAlign = "center";
	}
	else if(align === Text.LEFT)
	{
		this.element.style.justifyContent = "flex-start";
		this.element.style.textAlign = "left";
	}
	else if(align === Text.RIGHT)
	{
		this.element.style.justifyContent = "flex-end";
		this.element.style.textAlign = "right";
	}
};

Text.prototype.updateVisibility = function()
{
	this.element.style.visibility = this.visible ? "visible" : "hidden";
}

Text.prototype.updateSize = function()
{
	if(this.fitContent)
	{
		this.size.x = this.span.clientWidth;
		this.size.y = this.span.clientHeight;
	}
	
	Element.prototype.updateSize.call(this);
};