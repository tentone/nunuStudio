"use strict";

function ButtonImageToggle(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.button_color;
	
	//Prevent Drop event
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
	this.img.style.pointerEvents = "none";
	this.img.style.top = "0px";
	this.img.style.left = "0px";
	this.element.appendChild(this.img);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Image and Callback
	this.selected = false;
	this.image_scale = new THREE.Vector2(1,1);
	this.image = "";

	//Click event
	var self = this;
	this.element.onclick = function()
	{
		self.selected = !self.selected;
	};

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		self.element.style.backgroundColor = Editor.theme.button_over_color;
	};

	this.element.onmouseleave = function()
	{
		if(!self.selected)
		{
			self.element.style.backgroundColor = Editor.theme.button_color;
		}
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//Remove element
ButtonImageToggle.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
ButtonImageToggle.prototype.update = function(){}

//Set button callback function
ButtonImageToggle.prototype.setCallback = function(callback)
{
	var self = this;
	this.element.onclick = function()
	{
		self.selected = !self.selected;
		callback();	
	};
}

//Set ButtonImageToggle
ButtonImageToggle.prototype.setImage = function(image)
{
	this.img.src = image;
}

//Update Interface
ButtonImageToggle.prototype.updateInterface = function()
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

	//Set selected
	if(this.selected)
	{
		this.element.style.backgroundColor = Editor.theme.button_over_color;
	}
	else
	{
		this.element.style.backgroundColor = Editor.theme.button_color;
	}

	//Update image
	this.img.width = this.size.x * this.image_scale.x;
	this.img.height = this.size.y * this.image_scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.image_scale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.image_scale.y))/2) + "px";
	
	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}