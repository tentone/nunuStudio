"use strict";

function ContextMenu(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.zIndex = "300";

	//Attributes
	this.size = new THREE.Vector2(130,20);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Options
	this.options = [];

	//Self pointer
	var self = this;

	//Mouse leave
	this.element.onmouseleave = function()
	{
		self.destroy();
	};

	//Add element to document
	this.parent.appendChild(this.element);
}

//Set Text
ContextMenu.prototype.setText = function(text)
{
	this.text.setText(text);
};

//Remove element
ContextMenu.prototype.destroy = function()
{	
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}

	for(var k = 0; k < this.options.length; k++)
	{
		this.options[k].destroy();
	}
};

//Remove option from dropdown menu
ContextMenu.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
	}
};

//Add new Option to dropdown menu
ContextMenu.prototype.addOption = function(name, callback)
{
	var button = new Button(this.element);
	button.element.style.zIndex = "10000";
	button.text.setAlignment(Text.LEFT);
	button.text.position.x = 25;
	button.setText(name);

	var self = this;
	button.setCallback(function()
	{
		callback();
		self.destroy();
	});

	this.options.push(button);
};

//Update interface
ContextMenu.prototype.updateInterface = function()
{
	//Options
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.size.x, this.size.y);
		this.options[i].position.set(0, (this.size.y*i));
		this.options[i].visible = this.visible;
		this.options[i].updateInterface();
	}

	//Visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = (this.size.y * this.options.length)+ "px";
};