"use strict";

function Button(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//ID
	var id = "but" + Button.id;
	Button.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.cursor = "pointer";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.button_color;

	this.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	this.element.ondragover = function(event)
	{
		event.preventDefault();
	};
	
	//Text
	this.text = new Text(this.element);
	this.text.setText("text");

	//Children elements
	this.children = [];

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		this.style.backgroundColor = Editor.theme.button_over_color;
	};

	this.element.onmouseleave = function()
	{
		this.style.backgroundColor = Editor.theme.button_color;
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//Button conter
Button.id = 0;

//Add extra element to button
Button.prototype.add = function(element)
{
	this.children.push(element);
}

//Set Button text
Button.prototype.setText = function(text)
{
	this.text.setText(text);
}

//Remove element from document
Button.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].destroy();
	}
}

//Update status
Button.prototype.update = function(){}

//Set button callback function
Button.prototype.setCallback = function(callback)
{
	this.element.onclick = callback;
}

//Update Button Size
Button.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].visible = this.visible;
		this.children[i].updateInterface();
	}

	this.text.size.set(this.size.x, this.size.y);
	this.text.visible = this.visible;
	this.text.updateInterface();

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}