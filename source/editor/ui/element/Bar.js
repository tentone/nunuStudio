"use strict";

function Bar(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.backgroundColor = Editor.theme.barColor;

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};
	
	//Attributes
	this.fitParent = false;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Remove element
Bar.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update Bar
Bar.prototype.update = function(){}

//Update division Size
Bar.prototype.updateInterface = function()
{
	//Fit parent
	if(this.fitParent)
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