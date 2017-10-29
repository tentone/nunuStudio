"use strict";

function Message(parent)
{
	Element.call(this, parent);

	this.element.style.pointerEvents = "none";
	this.element.style.top = "0px";
	this.element.style.left = "0px";
	this.element.style.width = "100%";
	this.element.style.height = "100%";
	this.element.style.zIndex = "10000000";
	this.element.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
	this.element.style.alignItems = "center";
	this.element.style.justifyContent = "center";
	this.element.style.alignText = "center";
	this.element.style.display = "none";
	this.element.innerText = "message";
}

Message.prototype = Object.create(Element.prototype);

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