"use strict";

function Message(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.pointerEvents = "none";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "100%";
	this.element.style.zIndex = "10000000";
	this.element.style.backgroundColor = "#000000";
	this.element.style.opacity = "0.5";
	this.element.style.alignItems = "center";
	this.element.style.justifyContent = "center";
	this.element.style.alignText = "center";
	this.element.style.display = "none";
	this.element.innerText = "message";

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = false;
	
	//Add element to document
	this.parent.appendChild(this.element);
}

//Show message
Message.prototype.show = function(message)
{
	this.visible = true;
	this.element.innerText = message;
	this.element.style.display = "flex";
}

//Show message
Message.prototype.hide = function(message)
{
	this.visible = false;
	this.element.style.display = "none";
}

//Remove element
Message.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Update division Size
Message.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.display = "flex";
	}
	else
	{
		this.element.style.display = "none";
	}
};