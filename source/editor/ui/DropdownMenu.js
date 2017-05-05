"use strict";

function DropdownMenu(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
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

	//Panel
	this.panel = document.createElement("div");
	this.panel.style.position = "absolute";
	this.panel.style.cursor = "default";
	this.panel.style.zIndex = "200";

	//Icon
	this.icon = document.createElement("img");
	this.icon.style.position = "absolute";
	this.icon.style.display = "none";
	this.icon.style.left = "5px";
	this.icon.style.top = "3px";
	this.icon.style.width = "12px";
	this.icon.style.height = "12px";
	this.element.appendChild(this.icon);

	//Arrow
	this.arrow = document.createElement("img");
	this.arrow.style.position = "absolute";
	this.arrow.style.display = "none";
	this.arrow.style.right = "5px";
	this.arrow.style.top = "3px";
	this.arrow.style.width = "12px";
	this.arrow.style.height = "12px";
	this.arrow.src = Editor.filePath + "icons/misc/arrow_right.png";
	this.element.appendChild(this.arrow);

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Options
	this.optionsLocation = DropdownMenu.DOWN;
	this.optionsSize = new THREE.Vector2(150, 20);
	this.options = [];
	this.expanded = false;

	//Self pointer
	var self = this;

	//Mouse over
	this.element.onmouseover = function()
	{
		self.expanded = true;
		self.updateInterface();
		self.element.style.cursor = "pointer";
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave
	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.style.cursor = "default";
		self.element.style.backgroundColor = Editor.theme.buttonColor;
	};
	
	//Mouve over
	this.panel.onmouseover = function()
	{
		self.expanded = true;
		self.updateInterface();
	};

	//Mouse leave
	this.panel.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
	};

	//Add element to document
	this.parent.appendChild(this.element);
	this.parent.appendChild(this.panel);
}

//Dropdown position
DropdownMenu.DOWN = 0;
DropdownMenu.UP = 1;
DropdownMenu.LEFT = 2;
DropdownMenu.RIGHT = 3;

//Set location to where options should open
DropdownMenu.prototype.setLocation = function(location)
{
	this.optionsLocation = location;
};

//Enable arrow
DropdownMenu.prototype.showArrow = function()
{
	this.arrow.style.display = "block";
};

//Set icon
DropdownMenu.prototype.setIcon = function(icon)
{
	this.icon.style.display = "block";
	this.icon.src = icon;
};

//Set Text
DropdownMenu.prototype.setText = function(text)
{
	this.text.setText(text);
};

//Destroy element
DropdownMenu.prototype.destroy = function()
{
	if(this.parent.contains(this.element))
	{
		this.parent.removeChild(this.element);
	}

	if(this.parent.contains(this.panel))
	{
		this.parent.removeChild(this.panel);
	}
};

//Remove option from dropdown menu
DropdownMenu.prototype.removeOption = function(index)
{
	if(index >= 0 && index < this.options.length)
	{
		this.options[index].destroy();
		this.options.splice(index, 1);
		this.updateInterface();
	}
};

//Add new option to dropdown menu
DropdownMenu.prototype.addOption = function(name, callback, icon)
{
	var button = new Button(this.panel);
	button.element.style.zIndex = "200";
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
		button.setIcon(icon);
	}

	this.options.push(button);
	this.updateInterface();

	return button;
};

//Add new Option to dropdown menu
DropdownMenu.prototype.addMenu = function(name, icon)
{
	var menu = new DropdownMenu(this.panel);
	menu.setText(name);
	menu.setLocation(DropdownMenu.LEFT);
	menu.showArrow();
	menu.text.setAlignment(Text.LEFT);
	menu.text.position.set(25, 0);
	
	if(icon !== undefined)
	{
		menu.setIcon(icon);
	}

	this.options.push(menu);
	this.updateInterface();

	return menu;
};

//Update interface
DropdownMenu.prototype.updateInterface = function()
{
	if(this.visible && this.expanded)
	{
		//Options
		for(var i = 0; i < this.options.length; i++)
		{
			this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
			this.options[i].position.set(0, (this.optionsSize.y * i));
			this.options[i].updateInterface();
		}

		//Panel position
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
		this.panel.style.display = "block";
	}
	else
	{
		this.panel.style.display = "none";
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

	//Text
	this.text.size.set(this.size.x, this.size.y);
	this.text.visible = this.visible;
	this.text.updateInterface();

	//Element
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};