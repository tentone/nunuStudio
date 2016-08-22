"use strict";

function TabElement(parent, name, icon, closeable, container, index)
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
	var id = "tab" + TabGroup.id;
	TabElement.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.style.cursor = "default";
	this.element.style.overflow = "hidden";
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
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Tab group container information
	this.closeable = closeable;
	this.index = index;
	this.container = container;
	this.component = null;
	
	//Self pointer
	var self = this;

	//Button
	this.button = new Button(this.container.element);
	this.button.visible = true;
	this.button.size.set(container.options_size.x, container.options_size.y);
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

	//Mouse leave event (overrided)
	this.button.element.onmouseleave = function()
	{
		if(!self.isSelected())
		{
			self.button.element.style.backgroundColor = Editor.theme.button_color;
		}
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
		self.close();
	});
	this.close_button.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
}

//ID counter
TabElement.id = 0;

//Function prototypes
TabElement.prototype.close = close;
TabElement.prototype.setIcon = setIcon;
TabElement.prototype.setName = setName;
TabElement.prototype.updateMetadata = updateMetadata;
TabElement.prototype.activate = activate;
TabElement.prototype.select = select;
TabElement.prototype.isSelected = isSelected;
TabElement.prototype.update = update;
TabElement.prototype.destroy = destroy;
TabElement.prototype.attachComponent = attachComponent;
TabElement.prototype.updateInterface = updateInterface;

//Close this tab
function close()
{
	this.container.removeOption(this.index);
}

//Set tab element icon
function setIcon(icon)
{
	this.icon.setImage(icon);
}

//Set tab element name
function setName(text)
{
	if(text !== undefined && text.length > 9)
	{
		text = text.slice(0,9) + "...";
	}

	this.button.setText(text);
}

//Dectivate this tab
function updateMetadata()
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
	try
	{
		this.parent.removeChild(this.element);
	}
	catch(e){}

	this.close_button.destroy();
	this.icon.destroy();
	this.button.destroy();
}

//Attach component that will be auto resized with tab division
function attachComponent(component)
{
	this.component = component;
	if(this.component.parent !== this.element)
	{
		this.component.destroy();
		this.component.parent = this.element;
		this.element.appendChild(this.component.element);
	}
}

//Update Interface
function updateInterface()
{
	//Update button
	if(this.isSelected())
	{
		this.button.element.style.cursor = "pointer";
		this.button.element.style.backgroundColor = Editor.theme.button_over_color;
	}
	else
	{
		this.button.element.style.cursor = "default";
		this.button.element.style.backgroundColor = Editor.theme.button_color;
	}

	if(this.container.mode === TabGroup.TOP)
	{
		this.button.position.set(this.container.options_size.x * this.index, 0);
	}
	else if(this.container.mode === TabGroup.LEFT)
	{
		this.button.position.set(0, this.container.options_size.y * this.index);
	}
	this.button.visible = this.container.visible;
	this.button.updateInterface();

	//Update icon
	this.icon.visible = this.container.visible;
	this.icon.updateInterface();

	//Update close button
	if(this.closeable)
	{
		this.close_button.visible = this.container.visible;
		this.close_button.position.set(this.button.size.x - 20, 10);
		this.close_button.updateInterface();
	}

	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Update main element and attached component
	if(this.container.mode === TabGroup.TOP)
	{
		this.element.style.top = this.container.options_size.y + "px";
		this.element.style.left = "0px";
		this.element.style.width = this.size.x + "px";
		this.element.style.height = (this.size.y - this.button.size.y) + "px";

		//Update attached component
		if(this.component !== null)
		{
			this.component.visible = this.visible && this.container.visible;
			this.component.size.set(this.size.x, this.size.y - this.button.size.y);
			this.component.updateInterface();
		}
	}
	else if(this.container.mode === TabGroup.LEFT)
	{
		this.element.style.top = "0px";
		this.element.style.left = this.container.options_size.x + "px";
		this.element.style.width = (this.size.x - this.button.size.x) + "px";
		this.element.style.height = this.size.y + "px";

		//Update attached component
		if(this.component !== null)
		{
			this.component.visible = this.visible && this.container.visible;
			this.component.size.set(this.size.x - this.button.size.x, this.size.y);
			this.component.updateInterface();
		}
	}
}
