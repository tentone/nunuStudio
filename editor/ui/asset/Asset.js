"use strict";

function Asset(parent)
{
	//Parent
	if(parent === undefined)
	{
		this.parent = document.body;
	}
	else
	{
		this.parent = parent;
	}
	
	//ID
	var id = "asset" + Asset.id;
	Asset.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";
	
	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
	this.img.style.top = "5px";
	this.element.appendChild(this.img);

	//Text
	this.text = new Text(this.element);

	//Element atributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = true;

	//Icon scale
	this.scale = new THREE.Vector2(0.7, 0.7);

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

//Asset ID counter
Asset.id = 0;

//Set parent
Asset.prototype.setParent = function(parent)
{
	if(parent !== this.parent)
	{
		this.parent = parent;
		this.parent.appendChild(this.element);
	}
}

//Set file icon
Asset.prototype.setIcon = function(image)
{
	this.img.src = image;
}

//Set file label
Asset.prototype.setText = function(text)
{
	if(text.length > 8)
	{
		text = text.slice(0,8) + "...";
	}

	this.text.setText(text);
}

//Remove element
Asset.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update
Asset.prototype.update = function(){}

//Update Interface
Asset.prototype.updateInterface = function()
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

	//Update image
	this.img.width = this.size.x * this.scale.x;
	this.img.height = this.size.y * this.scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.scale.x))/2) + "px";

	//Update file text
	this.text.visible = this.visible;
	this.text.size.x = this.size.x;
	this.text.position.y = (this.size.y - 20);
	this.text.size.y = this.size.y - this.text.position.y;
	this.text.updateInterface();
	
	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}