"use strict";

function Text(parent)
{
	Element.call(this, parent);

	this.element.style.display = "flex";
	this.element.style.alignItems = "center";
	this.element.style.pointerEvents = "none";
	this.element.style.color = Editor.theme.textColor;
	
	this.setAlignment(Text.CENTER);

	//Span
	this.span = document.createElement("span");
	this.span.style.whiteSpace = "pre";
	this.span.innerHTML = "text";
	this.element.appendChild(this.span);

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
	this.span.innerHTML = text;
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

//Update Interface
Text.prototype.updateInterface = function()
{
	if(this.visible)
	{
		if(this.fitContent)
		{
			this.size.x = this.span.clientWidth;
			this.size.y = this.span.clientHeight;
		}

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