function TabElement(name, image, closeable, container, index)
{
	//Tab name and icon
	this.name = name;
	this.image = image;
	this.closeable = closeable;

	//Tab group container information
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
	this.button.setText(name);
	this.button.visible = true;
	this.button.position.set(container.options_size.x*index, 0);
	this.button.size.set(container.options_size.x, container.options_size.y);
	this.button.updateInterface();

	//Set button callback
	this.button.setCallback(function()
	{
		self.container.selectOption(self.index);
	});

	//Change button behavior
	this.button.element.onmouseover = function()
	{
		self.button.setClass("button_over");
	};
	this.button.element.onmouseleave = function()
	{
		if(!self.isSelected())
		{
			self.button.setClass("button");
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
	this.close_button.setCallback(function()
	{
		self.container.removeOption(self.index);
	});
	this.close_button.updateInterface();

	//Division
	this.division = new Division(this.container.element);
	this.division.element.className = "bar";
	this.division.visible = false;
	this.division.position.set(0, this.container.options_size.y);
	this.division.updateInterface();
}

//Function prototypes
TabElement.prototype.update = update;
TabElement.prototype.updateInterface = updateInterface;
TabElement.prototype.destroy = destroy;
TabElement.prototype.activate = activate;
TabElement.prototype.select = select;
TabElement.prototype.attachComponent = attachComponent;
TabElement.prototype.isSelected = isSelected;

//Activate this tab
function activate()
{
	if(this.component !== null)
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
function update(){}

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

	if(this.component !== null)
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