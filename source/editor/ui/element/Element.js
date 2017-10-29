"use strict";

function Element(parent, type)
{
	this.parent = (parent !== undefined) ? parent : document.body;

	this.element = document.createElement((type !== undefined) ? type : "div");
	this.element.style.position = "absolute";

	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	this.parent.appendChild(this.element);
}

Element.prototype.constructor = Element;

//Add drag and drog event prevention
Element.prototype.preventDragEvents = function()
{
	//Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Dragged over event
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};
};

//Set alt text, that is displayed when the mouse is over the element
Element.prototype.setAltText = function(altText)
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

	this.element.style.pointerEvents = "auto";

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

//Remove element
Element.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Update interface
Element.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
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