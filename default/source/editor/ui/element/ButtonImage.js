"use strict";

function ButtonImage(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;
	
	//ID
	var id = "but_img" + ButtonImage.id;
	ButtonImage.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";

	//Image
	this.img = document.createElement("img");
	this.img.style.pointerEvents = "none";
	this.img.style.position = "absolute";
	this.img.style.top = "0px";
	this.img.style.left = "0px";
	this.element.appendChild(this.img);

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Image and Callback
	this.image_scale = new THREE.Vector2(1,1);
	this.image = "";

	//Mouse over event
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.button_over_color;
	};

	//Mouse leave event
	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = "";
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//ButtonImage ID counter
ButtonImage.id = 0;

//Remove element
ButtonImage.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
ButtonImage.prototype.update = function(){}

//Set button callback function
ButtonImage.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
}

//Set ButtonImage
ButtonImage.prototype.setImage = function(image)
{
	this.image = image;
	this.img.src = this.image;
}

//Set alt text
ButtonImage.prototype.setAltText = function(alt_text)
{
	var text = new Text();//this.element);
	text.element.style.background = Editor.theme.bar_color;
	text.element.style.zIndex = "300";
	text.setText(alt_text);
	text.visible = false;
	text.fit_content = true;
	text.updateInterface();

	//Mouse mouse move event
	this.element.onmousemove = function(event)
	{
		text.size.set(0, 20);
		text.position.set(event.clientX - text.size.x/2, event.clientY - 30);
		text.visible = true;
		text.updateInterface();
	};

	//Mouse out event (to avoid overlap with mouse leave event)
	this.element.onmouseout = function()
	{
		text.visible = false;
		text.updateInterface();
	}
}

//Set button image visibility
ButtonImage.prototype.setVisibility = function(visible)
{
	this.visible = visible;

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
ButtonImage.prototype.updateInterface = function()
{
	//Update visibility
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

	//Update image
	this.img.width = this.size.x * this.image_scale.x;
	this.img.height = this.size.y * this.image_scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.image_scale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.image_scale.y))/2) + "px";
	
	//Update main element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}