"use strict";

function ImageBox(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;
	
	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.pointerEvents = "none";

	//Image
	this.img = document.createElement("img");
	this.img.style.pointerEvents = "none";
	this.img.style.position = "absolute";
	this.img.style.top = "0px";
	this.img.style.left = "0px";
	this.element.appendChild(this.img);

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//ImageBox
	this.keepAspectRatio = false;
	this.imageScale = new THREE.Vector2(1,1);

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set image onclick callback function
ImageBox.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
};

//Remove element
ImageBox.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}
};

//Set ImageBox
ImageBox.prototype.setImage = function(image)
{
	this.img.src = image;
};

//Update Interface
ImageBox.prototype.updateInterface = function()
{
	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Keep image aspect ratio
	if(this.keepAspectRatio)
	{
		if(this.size.x < this.size.y)
		{
			this.size.y = this.size.x * this.img.naturalHeight / this.img.naturalWidth;
		}
		else
		{
			this.size.x = this.size.y * this.img.naturalWidth / this.img.naturalHeight;
		}
	}

	//Image
	this.img.width = this.size.x * this.imageScale.x;
	this.img.height = this.size.y * this.imageScale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.imageScale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.imageScale.y))/2) + "px";
	
	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};
