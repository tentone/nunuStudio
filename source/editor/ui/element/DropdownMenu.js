"use strict";

function DropdownMenu(parent)
{
	Element.call(this, parent);

	this.element.style.backgroundColor = Editor.theme.buttonColor;
	this.element.style.cursor = "pointer";

	this.preventDragEvents();

	//Text
	this.text = new Text(this.element);

	//Panel
	this.panel = document.createElement("div");
	this.panel.style.position = "absolute";
	this.panel.style.display = "none";
	this.panel.style.cursor = "default";
	this.panel.style.zIndex = "300";

	//Icon
	this.icon = document.createElement("img");
	this.icon.style.display = "none";
	this.icon.style.position = "absolute";
	this.icon.style.left = "5px";
	this.icon.style.top = "3px";
	this.icon.style.width = "12px";
	this.icon.style.height = "12px";
	this.element.appendChild(this.icon);

	//Arrow
	this.arrow = document.createElement("img");
	this.arrow.style.display = "none";
	this.arrow.style.position = "absolute";
	this.arrow.style.right = "5px";
	this.arrow.style.top = "3px";
	this.arrow.style.width = "12px";
	this.arrow.style.height = "12px";
	this.arrow.src = Editor.filePath + "icons/misc/arrow_right.png";
	this.element.appendChild(this.arrow);

	//Options
	this.optionsLocation = DropdownMenu.DOWN;
	this.optionsSize = new THREE.Vector2(150, 20);
	this.options = [];
	this.expanded = false;

	//Self pointer
	var self = this;

	//Mouse over
	this.element.onmouseenter = function()
	{
		self.setExpanded(true);
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	//Mouse leave
	this.element.onmouseleave = function()
	{
		self.setExpanded(false);
		self.element.style.backgroundColor = Editor.theme.buttonColor;
	};
	
	//Mouve over
	this.panel.onmouseenter = function()
	{
		self.setExpanded(true);
	};

	//Mouse leave
	this.panel.onmouseleave = function()
	{
		self.setExpanded(false);
	};

	//Add element to document
	this.parent.appendChild(this.panel);
}

//Dropdown position
DropdownMenu.DOWN = 0;
DropdownMenu.UP = 1;
DropdownMenu.LEFT = 2;
DropdownMenu.RIGHT = 3;

DropdownMenu.prototype = Object.create(Element.prototype);

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
	}
};

//Add new option to dropdown menu
DropdownMenu.prototype.addOption = function(name, callback, icon)
{
	var button = new ButtonMenu(this.panel);
	button.element.style.zIndex = "200";
	button.text.setText(name);
	button.text.setAlignment(Text.LEFT);
	button.text.position.set(25, 0);

	var self = this;
	button.setCallback(function()
	{
		callback();
		self.setExpanded(false);
	});

	if(icon !== undefined)
	{
		button.setIcon(icon);
	}

	this.options.push(button);

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

	return menu;
};

//Update expanded state
DropdownMenu.prototype.setExpanded = function(expanded)
{
	this.expanded = expanded;

	if(this.expanded)
	{
		this.panel.style.display = "block";

		if(this.optionsLocation === DropdownMenu.DOWN)
		{
			this.panel.style.top = (this.position.y + this.size.y) + "px";
			this.panel.style.left = this.position.x + "px";

			var out = DOMUtils.checkBorder(this.panel);
			if(out.y !== 0)
			{
				this.panel.style.top = "";
				this.panel.style.bottom = (this.position.y + this.size.y) + "px";
			}
			if(out.x !== 0)
			{
				this.panel.style.left = (this.position.x - out.x) + "px"; 
			}
		}
		else if(this.optionsLocation === DropdownMenu.UP)
		{
			this.panel.style.bottom = (this.position.y + this.size.y) + "px";
			this.panel.style.left = this.position.x + "px";

			var out = DOMUtils.checkBorder(this.panel);
			if(out.y !== 0)
			{
				this.panel.style.bottom = "";
				this.panel.style.top = (this.position.y + this.size.y) + "px";
			}
			if(out.x !== 0)
			{
				this.panel.style.left = (this.position.x - out.x) + "px"; 
			}
		}
		else if(this.optionsLocation === DropdownMenu.LEFT)
		{
			this.panel.style.top = this.position.y + "px";
			this.panel.style.left = (this.position.x + this.size.x) + "px";

			var out = DOMUtils.checkBorder(this.panel);
			if(out.x !== 0)
			{
				this.panel.style.left = (this.position.x - this.size.x) + "px"; 
			}
			if(out.y !== 0)
			{
				this.panel.style.top = (this.position.y - out.y) + "px";
			}
		}
		else if(this.optionsLocation === DropdownMenu.RIGHT)
		{
			this.panel.style.top = this.position.y + "px";
			this.panel.style.left = (this.position.x - this.size.x) + "px";

			var out = DOMUtils.checkBorder(this.panel);
			if(out.x !== 0)
			{
				this.panel.style.left = (this.position.x + this.size.x) + "px";
			}
			if(out.y !== 0)
			{
				this.panel.style.top = (this.position.y - out.y) + "px";
			}
		}
	}
	else
	{
		this.panel.style.display = "none";
	}
};

//Update options
DropdownMenu.prototype.updateOptions = function()
{
	//Options
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
		this.options[i].position.set(0, this.optionsSize.y * i);
		this.options[i].updateInterface();
	}

	//Panel
	this.panel.style.width = this.size.x + "px";
	this.panel.style.height = (this.optionsSize.y * this.options.length) + "px";
};

//Update interface
DropdownMenu.prototype.updateInterface = function()
{
	if(this.visible)
	{
		this.element.style.visibility = "visible";

		this.updateOptions();

		//Text
		this.text.size.set(this.size.x, this.size.y);
		this.text.visible = this.visible;
		this.text.updateInterface();

		//Element
		this.element.style.top = this.position.y + "px";
		this.element.style.left = this.position.x + "px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = this.size.y + "px";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}
};
