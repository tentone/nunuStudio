"use strict";

function ButtonDrawer(parent)
{
	ButtonImage.call(this, parent);

	this.element.style.zIndex = "200";
	this.element.style.backgroundColor = Editor.theme.buttonColor;

	//Panel
	this.panel = new Element(parent, "div");
	this.panel.element.style.overflow = "visible";
	this.panel.element.style.backgroundColor = Editor.theme.barColor;
	this.panel.element.style.zIndex = "250";

	//Attributes
	this.panelSize = new THREE.Vector2(0, 0);
	this.panelPosition = new THREE.Vector2(0, 0);

	//Options
	this.options = [];
	this.optionsPerLine = 3;
	this.optionsSize = new THREE.Vector2(50, 50);
	this.optionsScale = new THREE.Vector2(0.7, 0.7);
	this.optionsSpacing = new THREE.Vector2(3, 3);
	this.expanded = false;

	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseenter = function()
	{
		self.expanded = true;
		self.updateInterface();
		self.element.style.backgroundColor = Editor.theme.buttonOverColor;
	};

	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.style.backgroundColor = Editor.theme.buttonColor;
	};

	this.panel.element.onmouseenter = function()
	{
		self.expanded = true;
		self.updateInterface();
	};

	this.panel.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
	};

	this.updatePanelSize();
}

ButtonDrawer.prototype = Object.create(ButtonImage.prototype);

ButtonDrawer.prototype.destroy = function()
{
	ButtonImage.prototype.destroy.call(this);

	this.parent.destroy();
};

/**
 * Add new option to the menu.
 * 
 * @method addOption
 */
ButtonDrawer.prototype.addOption = function(image, callback, altText)
{
	var button = new ButtonImage(this.panel);
	button.setImage(image);

	//Alt text
	if(altText !== undefined)
	{
		button.setAltText(altText);
	}

	//Button callback
	var self = this;
	button.setOnClick(function()
	{
		callback();
		self.expanded = false;
		self.updateInterface();
	});

	//Add button
	this.options.push(button);
	this.updatePanelSize();

	//Set button
	button.size.set(this.optionsSize.x, this.optionsSize.y);
	button.position.x = this.optionsSize.x * ((this.options.length - 1) % this.optionsPerLine);
	button.position.y = this.optionsSize.y * Math.floor((this.options.length - 1) / this.optionsPerLine);
	button.updateInterface();
};

/**
 * Remove option from the menu.
 *
 * @method removeOption
 */
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

/**
 * Updates drawer panel size.
 * 
 * @method updatePanelSize
 */
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
		this.options[i].position.x = this.optionsSize.x * (i % this.optionsPerLine);
		this.options[i].position.y = this.optionsSize.y * Math.floor(i / this.optionsPerLine);
		this.options[i].updateInterface();
	}
};

ButtonDrawer.prototype.updateVisibility = function()
{
	if(this.visible)
	{
		this.element.style.display = "block";
		this.panel.element.style.display = this.expanded ? "block" : "none";
	}
	else
	{
		this.element.style.display = "none";
		this.panel.element.style.display = "none";
	}
};

ButtonDrawer.prototype.updateSize = function()
{
	Element.prototype.updateSize.call(this);

	if(this.expanded)
	{
		this.panelPosition.x = this.position.x + this.size.x;
		this.panelPosition.y = this.position.y;
		
		this.panel.element.style.top = this.panelPosition.y + "px";
		this.panel.element.style.left = this.panelPosition.x + "px";
		this.panel.element.style.width = this.panelSize.x + "px";
		this.panel.element.style.height = this.panelSize.y + "px";
	}
};