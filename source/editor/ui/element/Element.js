"use strict";

function Element(parent, type)
{
	this.parent = (parent !== undefined) ? parent : document.body;

	this.element = document.createElement((type !== undefined) ? type : "div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "hidden";
	
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	this.parent.appendChild(this.element);
}

Element.prototype.constructor = Element;

Element.TOP_LEFT = 0;
Element.TOP_RIGHT = 1;
Element.BOTTOM_LEFT = 2;
Element.BOTTOM_RIGHT = 3;

//Add drag and drog event prevention
Element.prototype.preventDragEvents = function()
{
	function preventDefault(event)
	{
		event.preventDefault();
	}

	this.element.ondrop = preventDefault;
	this.element.ondragover = preventDefault;
};

//Set alt text, that is displayed when the mouse is over the element. Returns the element created that is attached to the document body.
Element.prototype.setAltText = function(altText)
{
	var element = document.createElement("div");
	element.style.position = "absolute";
	element.style.display = "none";
	element.style.alignItems = "center";
	element.style.zIndex = "10000";
	element.style.border = "3px solid";
	element.style.borderRadius = "5px";
	element.style.color = Editor.theme.textColor;
	element.style.backgroundColor = Editor.theme.barColor;
	element.style.borderColor = Editor.theme.barColor;
	element.style.width = "fit-content";
	element.style.height = "fit-content";
	document.body.appendChild(element);

	//Text
	var text = document.createTextNode(altText);
	element.appendChild(text);

	//Destroy
	var destroyFunction = this.destroy;
	this.destroy = function()
	{	
		destroyFunction.call(this);

		if(document.body.contains(element))
		{
			document.body.removeChild(element);
		}
	};
	
	this.element.style.pointerEvents = "auto"; 

	//Mouse mouse move event
	this.element.onmousemove = function(event)
	{
		element.style.display = "flex";
		element.style.left = event.clientX + "px";
		element.style.top = (event.clientY - 30) + "px";
	};

	//Mouse out event
	this.element.onmouseout = function()
	{
		element.style.display = "none";
	};

	return element;
};

Element.prototype.updatePosition = function(mode)
{
	if(mode === Element.TOP_LEFT || mode === Element.TOP_RIGHT)
	{
		this.element.style.top = this.position.y + "px";
		this.element.style.bottom = undefined;
	}
	else
	{
		this.element.style.bottom = this.position.y + "px";
		this.element.style.top = undefined;
	}

	if(mode === Element.TOP_LEFT || mode === Element.BOTTOM_LEFT)
	{
		this.element.style.left = this.position.x + "px";
		this.element.style.right = undefined;
	}
	else
	{
		this.element.style.right = this.position.x + "px";
		this.element.style.left = undefined;
	}
};

Element.prototype.updateSize = function()
{
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};

Element.prototype.setVisibility = function(visible)
{
	this.visible = visible;
	this.element.style.visibility = this.visible ? "visible" : "hidden";
};

Element.prototype.setBackgroundColor = function(color)
{
	this.element.style.backgroundColor = color;
};

Element.prototype.setCursor = function(cursor)
{
	this.element.style.cursor = cursor;
};

//Attach element to new parent
Element.prototype.attachTo = function(parent)
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}

	this.parent = parent;
	this.parent.appendChild(this.element);
	this.updateInterface();
};

Element.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

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
