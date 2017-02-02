"use strict";

function TextureTab(parent, closeable, container, index)
{
	TabElement.call(this, parent, closeable, container, index, "Console", "editor/files/icons/misc/console.png");

	//TODO <ADD CODE HERE>
}

TextureTab.prototype = Object.create(TabElement.prototype);

//Update division Size
TextureTab.prototype.updateInterface = function()
{
	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	
	//TODO <ADD CODE HERE>

	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
