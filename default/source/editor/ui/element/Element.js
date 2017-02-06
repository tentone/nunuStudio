"use strict";

function Element(parent, tag)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement(tag);
	this.element.id = tag + Element.id++;
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Attributes
	this.fit_parent = false;
	this.visible = true;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	
	//Add to parent
	this.parent.appendChild(this.element);
}

//Element conter
Element.id = 0;

//Remove element
Element.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
Element.prototype.update = function(){}

//Update division Size
Element.prototype.updateInterface = function()
{
	//Fit parent
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}