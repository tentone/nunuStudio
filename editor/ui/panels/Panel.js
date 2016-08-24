"use strict";

function Panel(parent)
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
	Panel.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.overflow = "auto";
	this.element.style.cursor = "default";
	this.element.style.backgroundColor = Editor.theme.panel_color;

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

	//Element atributes
	this.fit_parent = true;
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Default form
	this.form = new Form(this.element);
	this.form.position.set(5, 10);
	this.form.spacing.set(5, 5);

	//Object attached
	this.obj = null;

	//Add element to document
	this.parent.appendChild(this.element);
}

//Panel conter
Panel.id = 0;

//Update panel with object data
Panel.prototype.updatePanel = function(){}

//Attach object to panel
Panel.prototype.attachObject = function(obj)
{
	if(obj instanceof THREE.Object3D)
	{
		this.obj = obj;
		this.updatePanel();
	}
}

//Remove element
Panel.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}
}

//Update Panel
Panel.prototype.update = function(){}

//Update division Size
Panel.prototype.updateInterface = function()
{
	if(this.fit_parent)
	{
		this.size.x = this.parent.offsetWidth;
		this.size.y = this.parent.offsetHeight; 
	}
	
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}
