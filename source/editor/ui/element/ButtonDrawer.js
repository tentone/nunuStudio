"use strict";

function ButtonDrawer(parent)
{
	//Parent
	this.parent = (parent !== undefined) ? parent : document.body;

	//Create element
	this.element = document.createElement("div");
	this.element.style.position = "absolute";
	this.element.style.zIndex = "200";
	this.element.style.cursor = "pointer";
	this.element.style.display = "flex";
	this.element.style.justifyContent = "center";
	this.element.style.alignItems = "center";
	this.element.style.backgroundColor = Editor.theme.buttonColor;
	
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
	this.panel.style.backgroundColor = Editor.theme.barColor;
	this.panel.style.zIndex = "250";
	
	//Image
	this.img = document.createElement("img");
	this.img.style.position = "absolute";
	this.img.style.pointerEvents = "none";
	this.img.style.top = "0px";
	this.img.style.left = "0px";
	this.element.appendChild(this.img);

	//Attributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Panel atributes
	this.panelSize = new THREE.Vector2(0, 0);
	this.panelPosition = new THREE.Vector2(0, 0);

	//Image
	this.imageScale = new THREE.Vector2(1,1);
	this.image = "";

	//Options
	this.optionsPerLine = 3;
	this.options = [];
	this.optionsSize = new THREE.Vector2(50, 50);
	this.optionsScale = new THREE.Vector2(1, 1);
	this.optionsSpacing = new THREE.Vector2(3, 3);
	this.expanded = false;

	//Click event
	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
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
};

//Add new Option to dropdown menu
ButtonDrawer.prototype.addOption = function(image, callback, altText)
{
	var button = new ButtonImage(this.panel);
	button.setImage(image);
	button.visible = this.expanded;

	//Set alt text
	if(altText !== undefined)
	{
		button.setAltText(altText);
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
	button.size.set(this.optionsSize.x, this.optionsSize.y);
	button.imageScale.set(this.optionsScale.x, this.optionsScale.y);
	button.position.x = this.optionsSize.x * ((this.options.length - 1) % this.optionsPerLine);
	button.position.y = this.optionsSize.y * Math.floor((this.options.length - 1) / this.optionsPerLine);
	button.updateInterface();
};

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
};

//Set button draw icon image
ButtonDrawer.prototype.setImage = function(image)
{
	this.image = image;
	this.img.src = this.image;
};

//Updates drawer panel size
ButtonDrawer.prototype.updatePanelSize = function()
{
	this.panelSize.x = (this.optionsSize.x * this.optionsPerLine);
	this.panelSize.y = (this.optionsSize.y * (Math.floor((this.options.length - 1) / this.optionsPerLine) + 1));
};

//Update drawer options position and size (should be called after change in options displacement variables)
ButtonDrawer.prototype.updateOptions = function()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.optionsSize.x, this.optionsSize.y);
		this.options[i].imageScale.set(this.optionsScale.x, this.optionsScale.y);
		this.options[i].position.x = this.optionsSize.x * (i % this.optionsPerLine);
		this.options[i].position.y = this.optionsSize.y * Math.floor(i / this.optionsPerLine);
		this.options[i].visible = (this.expanded && this.visible);
		this.options[i].updateInterface();
	}
};

//Update Interface
ButtonDrawer.prototype.updateInterface = function()
{
	//Update panel position
	this.panelPosition.x = this.position.x + this.size.x;
	this.panelPosition.y = this.position.y;

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
	this.panel.style.top = this.panelPosition.y + "px";
	this.panel.style.left = this.panelPosition.x + "px";
	this.panel.style.width = this.panelSize.x + "px";
	this.panel.style.height = this.panelSize.y + "px";
	
	this.img.width = this.size.x * this.imageScale.x;
	this.img.height = this.size.y * this.imageScale.y;
	this.img.style.left = ((this.size.x - (this.size.x * this.imageScale.x))/2) + "px";
	this.img.style.top = ((this.size.y - (this.size.y * this.imageScale.y))/2) + "px";

	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
};