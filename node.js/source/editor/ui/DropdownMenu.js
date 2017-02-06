"use strict";

function DropdownMenu(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.zIndex = "100";
	this.element.style.cursor = "default";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	
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
	this.text.position.set(0, 0);
	this.text.size.set(0 , 0);

	//Options Panel
	this.panel = document.createElement("div");
	this.panel.style.position = "absolute";
	this.panel.style.cursor = "default";
	this.panel.style.zIndex = "200";

	//Atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Children elements
	this.children = [];

	//Options
	this.optionsLocation = DropdownMenu.DOWN;
	this.optionsSize = new THREE.Vector2(150, 20);
	this.options = [];
	this.expanded = false;

	//Click event
	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseover = function()
	{
		self.expanded = true;
		self.updateInterface();
		self.element.style.cursor = "pointer";
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.style.cursor = "default";
		self.element.style.backgroundColor = Editor.theme.buttonColor;
	};
	
	this.panel.onmouseover = function()
	{
		self.expanded = true;
		self.updateInterface();
	};

	this.panel.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
	};

	//Add element to document
	this.parent.appendChild(this.element);
	this.parent.appendChild(this.panel);
}

//Options location
DropdownMenu.DOWN = 0;
DropdownMenu.UP = 1;
DropdownMenu.LEFT = 2;
DropdownMenu.RIGHT = 3;

//Add extra element to dropdown
DropdownMenu.prototype.add = function(element)
{
	this.children.push(element);
}

//Set location to where options should open
DropdownMenu.prototype.setLocation = function(location)
{
	this.optionsLocation = location;
}

//Set Text
DropdownMenu.prototype.setText = function(text)
{
	this.text.setText(text);
}

//Remove element
DropdownMenu.prototype.destroy = function()
{
	try
	{
		this.parent.removeChild(this.element);
		this.parent.removeChild(this.panel);
	}
	catch(e){}
}

//Update
DropdownMenu.prototype.update = function(){}

//Remove option from dropdown menu
DropdownMenu.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
		this.updateInterface();
	}
}

//Add new Option to dropdown menu
DropdownMenu.prototype.addOption = function(name, callback, icon)
{
	var button = new Button(this.panel);
	button.element.style.zIndex = "200";
	button.visible = this.expanded;
	button.setText(name);
	button.text.setAlignment(Text.LEFT);
	button.text.position.set(25, 0);

	var self = this;
	button.setCallback(function()
	{
		callback();
		self.expanded = false;
		self.updateInterface();
	});

	if(icon !== undefined)
	{
		var image = new ImageBox(button.element);
		image.setImage(icon);
		image.size.set(12, 12);
		image.position.set(5, 3);
		button.add(image);
	}

	this.options.push(button);
	this.updateInterface();

	return button;
}

//Add new Option to dropdown menu
DropdownMenu.prototype.addMenu = function(name, icon)
{
	var menu = new DropdownMenu(this.panel);
	menu.visible = this.expanded;
	menu.setText(name);
	menu.setLocation(DropdownMenu.LEFT);
	menu.text.setAlignment(Text.LEFT);
	menu.text.position.set(25, 0);

	if(icon !== undefined)
	{
		var image = new ImageBox(menu.element);
		image.setImage(icon);
		image.size.set(12, 12);
		image.position.set(5, 3);
		menu.add(image);
	}

	var arrow = new ImageBox(menu.element);
	arrow.setImage("editor/files/icons/misc/arrow_right.png");
	arrow.size.set(12, 12);
	arrow.position.set(this.optionsSize.x - 20, 3);
	menu.add(arrow);

	this.options.push(menu);
	this.updateInterface();

	return menu;
}

//Update interface
DropdownMenu.prototype.updateInterface = function()
{
	//Visibility
	var visibility, visible;

	if(this.expanded && this.visible)
	{
		visibility = "visible";
		visible = true;
	}
	else
	{
		visibility = "hidden";
		visible = false;
	}

	//Options
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].visible = visible;
		this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
		this.options[i].position.set(0, (this.optionsSize.y*i));
		this.options[i].updateInterface();
	}

	//Attached elements
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].visible = this.visible;
		this.children[i].updateInterface();
	}

	//Text
	this.text.size.set(this.size.x, this.size.y);
	this.text.visible = this.visible;
	this.text.updateInterface();

	//Panel position, size and visibility
	if(this.optionsLocation === DropdownMenu.DOWN)
	{
		this.panel.style.top = (this.position.y + this.size.y) + "px";
		this.panel.style.left = this.position.x + "px";
	}
	else if(this.optionsLocation === DropdownMenu.UP)
	{
		this.panel.style.top = (this.position.y - this.size.y) + "px";
		this.panel.style.left = this.position.x + "px";
	}
	else if(this.optionsLocation === DropdownMenu.LEFT)
	{
		this.panel.style.top = this.position.y + "px";
		this.panel.style.left = (this.position.x + this.size.x) + "px";
	}
	else if(this.optionsLocation === DropdownMenu.RIGHT)
	{
		this.panel.style.top = this.position.y + "px";
		this.panel.style.left = (this.position.x - this.size.x) + "px";
	}

	this.panel.style.width = this.size.x + "px";
	this.panel.style.height = (this.optionsSize.y * this.options.length) + "px";
	this.panel.style.visibility = visibility;

	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Element position and size
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}