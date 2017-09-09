"use strict";

function PassNode(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";
	this.element.style.pointerEvents = "none";
	this.element.style.backgroundColor = Editor.theme.panelColor;

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;
	
	//Add element to document
	this.parent.appendChild(this.element);

	var self = this;
}

//Remove element
PassNode.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Update division Size
PassNode.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.display = "block";
		
		//Element
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