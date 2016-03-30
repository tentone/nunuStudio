function TabElement(name, image, closeable, container, index)
{
	//Tab name and icon
	this.name = name;
	this.image = image;
	this.closeable = closeable;

	//Container info
	this.index = index;
	this.container = container;
	this.component = null;

	//Atributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = false;

	//Self pointer
	var self = this;

	//Button
	this.button = new Button(this.container.element);
	this.button.text = name;
	this.button.visible = true;
	this.button.position.set(container.options_size.x*index, 0);
	this.button.size.set(container.options_size.x, container.options_size.y);
	this.button.callback = function()
	{
		self.container.selectOption(self.index);
	};
	this.button.updateInterface();

	//Change button behavior
	this.button.element.onmouseover = function()
	{
		self.button.element.className = "button_over";
	};

	this.button.element.onmouseout = function()
	{
		if(!self.isSelected())
		{
			self.button.element.className = "button";
		}
	};

	//Icon
	this.icon = new Image(this.button.element);
	this.icon.size.set(15, 15);
	this.icon.position.set(7, 7);
	this.icon.setImage(image);
	this.icon.updateInterface();

	//Close button
	this.close_button = new ButtonImage(this.button.element);
	this.close_button.visible = this.closeable;
	this.close_button.size.set(10, 10);
	this.close_button.position.set(this.button.size.x - 20, 10);
	this.close_button.setImage("editor/files/icons/misc/close.png");
	this.close_button.callback = function()
	{
		self.container.removeOption(self.index);
	};
	this.close_button.updateInterface();

	//Division
	this.division = new Division(this.container.element);
	this.division.element.className = "bar";
	this.division.visible = false;
	this.division.position.set(0, this.container.options_size.y);
	this.division.updateInterface();
}

TabElement.prototype.update = update;
TabElement.prototype.updateInterface = updateInterface;
TabElement.prototype.attachComponent = attachComponent;
TabElement.prototype.destroy = destroy;
TabElement.prototype.isSelected = isSelected;

//Check if taboption is selected
function isSelected()
{
	return (this.index == this.container.options_selected);
}

//Update taboption status
function update()
{
	if(this.component != null)
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
	this.division.element.appendChild(this.component.element);
}

//Update Interface
function updateInterface()
{
	if(this.isSelected())
	{
		this.button.setClass("button_over");
	}
	else
	{
		this.button.setClass("button");
	}
	this.button.position.set(this.container.options_size.x * this.index, 0);
	this.division.visible = this.visible;
	this.division.size.set(this.size.x, this.size.y - this.button.size.y);

	if(this.component != null)
	{
		this.component.visible = this.visible;
		this.component.size.set(this.division.size.x, this.division.size.y);
		this.component.updateInterface();
	}

	if(this.closeable)
	{
		this.close_button.position.set(this.button.size.x - 20, 10);
		this.close_button.updateInterface();
	}

	this.button.updateInterface();
	this.division.updateInterface();
}