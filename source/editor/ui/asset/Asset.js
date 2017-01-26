"use strict";

function Asset(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;
	
	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";

	//Icon
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.style.bottom = "15px";
	this.icon.style.right = "5px";
	this.icon.style.width = "20px";
	this.icon.style.height = "20px";
	this.icon.style.zIndex = 1;
	this.element.appendChild(this.icon);

	//Text
	this.text = document.createElement("div");
	this.text.style.position = "absolute";
	this.text.style.overflow = "hidden";
	this.text.style.textAlign = "center";
	this.text.style.pointerEvents = "none";
	this.text.style.textOverflow = "ellipsis";
	this.text.style.whiteSpace = "nowrap";
	this.text.style.color = Editor.theme.text_color;
	this.text.style.height = "20px";
	this.text.innerHTML = "";
	this.element.appendChild(this.text);

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
Asset.prototype.setIcon = function(icon)
{
	this.icon.src = icon;
}

//Set file label
Asset.prototype.setText = function(text)
{
	this.text.innerHTML = text;
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
		this.text.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.text.style.visibility = "hidden";
	}

	//Update file text
	this.text.style.top = (this.size.y - 20) + "px";
	this.text.style.width = this.size.x + "px";
	
	//Update element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}