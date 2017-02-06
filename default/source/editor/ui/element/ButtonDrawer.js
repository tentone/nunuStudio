"use strict";

function ButtonDrawer(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;
	
	//ID
	var id = "drawer" + ButtonDrawer.id;
	ButtonDrawer.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.zIndex = "200";
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

	//Create Drawer Panel
	this.panel = document.createElement("div");
	this.panel.style.position = "absolute";
	this.panel.style.cursor = "default";
	this.panel.style.backgroundColor = Editor.theme.bar_color;
	this.panel.style.zIndex = "250";
	
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

	//Panel atributes
	this.panel_size = new THREE.Vector2(0, 0);
	this.panel_position = new THREE.Vector2(0, 0);

	//Image
	this.image_scale = new THREE.Vector2(1,1);
	this.image = "";

	//Options
	this.options_per_line = 3;
	this.options = [];
	this.options_size = new THREE.Vector2(50, 50);
	this.options_scale = new THREE.Vector2(1, 1);
	this.options_spacing = new THREE.Vector2(3, 3);
	this.expanded = false;

	//Click event
	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		self.expanded = true;
		self.updateInterface();
		self.element.style.cursor = "pointer";
		self.element.style.backgroundColor = Editor.theme.button_over_color;
	};

	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.style.cursor = "default";
		self.element.style.backgroundColor = Editor.theme.button_color;
	};

	this.panel.onmouseenter = function()
	{
		self.expanded = true;
		self.updateInterface();
	};

	this.panel.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
	};

	this.updatePanelSize();

	//Add element to document
	this.parent.appendChild(this.element);
	this.parent.appendChild(this.panel);
}

//ButtonDrawer ID counter
ButtonDrawer.id = 0;

//Remove element
ButtonDrawer.prototype.destroy = function()
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
}

//Add new Option to dropdown menu
ButtonDrawer.prototype.addOption = function(image, callback, alt_text)
{
	var button = new ButtonImage(this.panel);
	button.setImage(image);
	button.visible = this.expanded;

	//Set alt text
	if(alt_text !== undefined)
	{
		button.setAltText(alt_text);
	}

	//Set button callback
	var self = this;
	button.setCallback(function()
	{
		callback();
		self.expanded = false;
		self.updateInterface();
	});

	//Add button to drawer
	this.options.push(button);
	this.updatePanelSize();

	//Set button
	button.size.set(this.options_size.x, this.options_size.y);
	button.image_scale.set(this.options_scale.x, this.options_scale.y);
	button.position.x = this.options_size.x * ((this.options.length - 1) % this.options_per_line);
	button.position.y = this.options_size.y * Math.floor((this.options.length - 1) / this.options_per_line);
	button.updateInterface();
}

//Remove option from dropdown menu
ButtonDrawer.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
		this.updatePanelSize();
		this.updateInterface();
	}
}

//Set button draw icon image
ButtonDrawer.prototype.setImage = function(image)
{
	this.image = image;
	this.img.src = this.image;
}

//Update
ButtonDrawer.prototype.update = function(){}

//Updates drawer panel size
ButtonDrawer.prototype.updatePanelSize = function()
{
	this.panel_size.x = (this.options_size.x * this.options_per_line);
	this.panel_size.y = (this.options_size.y * (Math.floor((this.options.length - 1) / this.options_per_line) + 1));
}

//Update drawer options position and size (should be called after change in options displacement variables)
ButtonDrawer.prototype.updateOptions = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.options_size.x, this.options_size.y);
		this.options[i].image_scale.set(this.options_scale.x, this.options_scale.y);
		this.options[i].position.x = this.options_size.x * (i % this.options_per_line);
		this.options[i].position.y = this.options_size.y * Math.floor(i / this.options_per_line);
		this.options[i].visible = (this.expanded && this.visible);
		this.options[i].updateInterface();
	}
}

//Update Interface
ButtonDrawer.prototype.updateInterface = function()
{
	//Update panel position
	this.panel_position.x = this.position.x + this.size.x;
	this.panel_position.y = this.position.y;

	//Update options
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].setVisibility(this.expanded && this.visible);
	}

	//Set Visibility
	if(this.expanded)
	{
		this.panel.style.visibility = "visible";
	}
	else
	{
		this.panel.style.visibility = "hidden";
	}

	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
		this.panel.style.visibility = "hidden";
	}

	//Calculate panel size
	this.panel.style.top = this.panel_position.y + "px";
	this.panel.style.left = this.panel_position.x + "px";
	this.panel.style.width = this.panel_size.x + "px";
	this.panel.style.height = this.panel_size.y + "px";
	
	this.img.width = this.size.x * this.image_scale.x;
	this.img.height = this.size.y * this.image_scale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.image_scale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.image_scale.y))/2) + "px";

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}