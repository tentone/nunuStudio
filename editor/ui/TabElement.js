function TabElement(name, icon, closeable, container, index)
{
	//Tab group container information
	this.index = index;
	this.container = container;
	this.component = null;

	//Tab closeable
	this.closeable = closeable;

	//Atributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = false;

	//Self pointer
	var self = this;

	//Button
	this.button = new Button(this.container.element);
	this.button.visible = true;
	this.button.size.set(container.options_size.x, container.options_size.y);

	//Set button as draggable
	this.button.element.draggable = true;
	
	//Set button callback
	this.button.setCallback(function(event)
	{
		//Select tab if mouse left click
		if(event.which - 1 === Mouse.LEFT)
		{
			self.container.selectOption(self.index);
		}
		//Close tab if mouse mid click
		else if(self.closeable && event.which - 1 === Mouse.MIDDLE)
		{
			self.container.removeOption(self.index);
		}
	});

	//Mouse over event (overrided)
	this.button.element.onmouseenter = function()
	{
		self.button.setClass("button_over");
	};

	//Mouse leave event (overrided)
	this.button.element.onmouseleave = function()
	{
		if(!self.isSelected())
		{
			self.button.setClass("button");
		}
	};

	//Drop event
	this.button.element.ondrop = function(event)
	{
		event.preventDefault();
	};

	//Prevent deafault when object dragged over
	this.button.element.ondragover = function(event)
	{
		event.preventDefault();
	};

	//Icon
	this.icon = new Image(this.button.element);
	this.icon.size.set(15, 15);
	this.icon.position.set(7, 7);
	this.icon.updateInterface();

	//Set name and icon
	this.setName(name);
	this.setIcon(icon);

	//Close button
	this.close_button = new ButtonImage(this.button.element);
	this.close_button.visible = this.closeable;
	this.close_button.size.set(10, 10);
	this.close_button.position.set(this.button.size.x - 20, 10);
	this.close_button.setImage("editor/files/icons/misc/close.png");
	this.close_button.setCallback(function()
	{
		self.container.removeOption(self.index);
	});
	this.close_button.updateInterface();

	//Division
	this.division = new Division(this.container.element);
	this.division.visible = false;
	this.division.element.className = "container";
	this.division.position.set(0, this.container.options_size.y);
}

//Function prototypes
TabElement.prototype.update = update;
TabElement.prototype.updateInterface = updateInterface;
TabElement.prototype.destroy = destroy;
TabElement.prototype.activate = activate;
TabElement.prototype.updateObjectData = updateObjectData;
TabElement.prototype.select = select;
TabElement.prototype.attachComponent = attachComponent;
TabElement.prototype.isSelected = isSelected;
TabElement.prototype.setName = setName;
TabElement.prototype.setIcon = setIcon;

//Set tab element icon
function setIcon(icon)
{
	this.icon.setImage(icon);
}

//Set tab element name
function setName(text)
{
	if(text.length > 9)
	{
		text = text.slice(0,9) + "...";
	}

	this.button.setText(text);
}

//Dectivate this tab
function updateObjectData()
{
	if(this.component !== null)
	{
		this.component.updateMetadata(this);
	}
}

//Activate this tab
function activate()
{
	if(this.component !== null && this.component.activate !== undefined)
	{
		this.component.activate();
	}
}

//Selects this tab element on tabcontainer
function select()
{
	this.container.selectOption(this.index);
}

//Check if this tab element is selected
function isSelected()
{
	return this.index === this.container.options_selected;
}

//Update taboption status
function update()
{
	if(this.component !== null)
	{
		this.component.update();
	}
}

//Destroy
function destroy()
{
	this.division.destroy();
	this.button.destroy();
}

//Attach component that will be auto resized with tab division
function attachComponent(component)
{
	this.component = component;
	this.component.destroy();
	this.component.parent = this.division.element;
	this.division.element.appendChild(this.component.element);
}

//Update Interface
function updateInterface()
{
	//Update button
	if(this.isSelected())
	{
		this.button.setClass("button_over");
	}
	else
	{
		this.button.setClass("button");
	}
	if(this.container.mode === TabGroup.TOP)
	{
		this.button.position.set(this.container.options_size.x*this.index, 0);
	}
	else if(this.container.mode === TabGroup.LEFT)
	{
		this.button.position.set(0, this.container.options_size.y*this.index);
	}
	this.button.visible = this.container.visible;
	this.button.updateInterface();

	//Update icon
	this.icon.visible = this.container.visible;
	this.icon.updateInterface();

	//Update division
	this.division.visible = this.visible && this.container.visible;
	if(this.container.mode === TabGroup.TOP)
	{
		this.division.position.set(0, this.container.options_size.y);
		this.division.size.set(this.size.x, this.size.y - this.button.size.y);
	}
	else if(this.container.mode === TabGroup.LEFT)
	{
		this.division.position.set(this.container.options_size.x, 0);
		this.division.size.set(this.size.x - this.button.size.x, this.size.y);
	}
	this.division.updateInterface();

	//Update attached component
	if(this.component !== null)
	{
		this.component.visible = this.visible && this.container.visible;
		this.component.size.set(this.division.size.x, this.division.size.y);
		this.component.updateInterface();
	}

	//Position close button if needed
	if(this.closeable)
	{
		this.close_button.visible = this.container.visible;
		this.close_button.position.set(this.button.size.x - 20, 10);
		this.close_button.updateInterface();
	}
}
