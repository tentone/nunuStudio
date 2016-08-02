"use strict";

function DropdownMenu(parent)
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
	var id = "dropmenu" + Button.id;
	DropdownMenu.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.zIndex = "100";
	this.element.style.cursor = "default";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.button_color;
	
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
	this.options_location = DropdownMenu.DOWN;
	this.options_size = new THREE.Vector2(150, 20);
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
		self.element.style.backgroundColor = Editor.theme.button_over_color;
	};

	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.style.cursor = "default";
		self.element.style.backgroundColor = Editor.theme.button_color;
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

	//Update element
	this.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
	this.parent.appendChild(this.panel);
}

//DropdownMenu ID counter
DropdownMenu.id = 0;

//Options location
DropdownMenu.DOWN = 0;
DropdownMenu.LEFT = 1;
DropdownMenu.RIGHT = 1;

//Functions Prototype
DropdownMenu.prototype.update = update;
DropdownMenu.prototype.updateInterface = updateInterface;
DropdownMenu.prototype.addOption = addOption;
DropdownMenu.prototype.addMenu = addMenu;
DropdownMenu.prototype.removeOption = removeOption;
DropdownMenu.prototype.destroy = destroy;
DropdownMenu.prototype.setText = setText;
DropdownMenu.prototype.setLocation = setLocation;
DropdownMenu.prototype.add = add;

//Add extra element to dropdown
function add(element)
{
	this.children.push(element);
}

//Set location to where options should open
function setLocation(location)
{
	this.options_location = location;
}

//Set Text
function setText(text)
{
	this.text.setText(text);
}

//Remove element
function destroy()
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
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].destroy();
	}
}

//Update
function update(){}

//Remove option from dropdown menu
function removeOption(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
		this.updateInterface();
	}
}

//Add new Option to dropdown menu
function addOption(name, callback, icon)
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
		var image = new Image(button.element);
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
function addMenu(name, icon)
{
	var menu = new DropdownMenu(this.panel);
	menu.visible = this.expanded;
	menu.setText(name);
	menu.setLocation(DropdownMenu.LEFT);
	menu.text.setAlignment(Text.LEFT);
	menu.text.position.set(25, 0);

	if(icon !== undefined)
	{
		var image = new Image(menu.element);
		image.setImage(icon);
		image.size.set(12, 12);
		image.position.set(5, 3);
		menu.add(image);
	}

	var arrow = new Image(menu.element);
	arrow.setImage("editor/files/icons/misc/arrow_right.png");
	arrow.size.set(12, 12);
	arrow.position.set(this.options_size.x - 20, 3);
	menu.add(arrow);

	this.options.push(menu);
	this.updateInterface();

	return menu;
}

//Update interface
function updateInterface()
{
	var visibility, visible = false;

	if(this.expanded && this.visible)
	{
		visibility = "visible";
		visible = true;
	}
	else
	{
		visibility = "hidden";
	}

	//Update Options Visibility
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].visible = visible;
		this.options[i].size.set(this.options_size.x, this.options_size.y);
		this.options[i].position.set(0, (this.options_size.y*i));
		this.options[i].updateInterface();
	}

	//Update attached elements if any
	for(var i = 0; i < this.children.length; i++)
	{
		this.children[i].visible = this.visible;
		this.children[i].updateInterface();
	}

	//Update text
	this.text.size.set(this.size.x, this.size.y);
	this.text.visible = this.visible;
	this.text.updateInterface();

	//Panel position, size and visibility
	if(this.options_location === DropdownMenu.DOWN)
	{
		this.panel.style.top = (this.position.y + this.size.y) + "px";
		this.panel.style.left = this.position.x + "px";
	}
	else if(this.options_location === DropdownMenu.LEFT)
	{
		this.panel.style.top = this.position.y + "px";
		this.panel.style.left = (this.position.x + this.size.x) + "px";
	}
	else if(this.options_location === DropdownMenu.RIGHT)
	{
		this.panel.style.top = this.position.y + "px";
		this.panel.style.left = (this.position.x - this.size.x) + "px";
	}

	this.panel.style.width = this.size.x + "px";
	this.panel.style.height = (this.options_size.y * this.options.length) + "px";
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