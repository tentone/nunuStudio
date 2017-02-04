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

	//Element atributes
	this.fitParent = false;
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
}

//Remove element
ImageBox.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
ImageBox.prototype.update = function(){}

//Set ImageBox
ImageBox.prototype.setImage = function(image)
{
	this.img.src = image;
}

//Set element visibility
ImageBox.prototype.setVisibility = function(value)
{
	this.visible = value;

	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.img.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.img.style.visibility = "hidden";
	}
}

//Update Interface
ImageBox.prototype.updateInterface = function()
{
	//Fit parent element
	if(this.fitParent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}

	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
		this.img.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.img.style.visibility = "hidden";
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

	//Update img
	this.img.width = this.size.x * this.imageScale.x;
	this.img.height = this.size.y * this.imageScale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.imageScale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.imageScale.y))/2) + "px";
	
	//Update base element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
