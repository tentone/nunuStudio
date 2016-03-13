function TabOption(name, image, container, index)
{
	//Tab name and icon
	this.name = name;
	this.image = image;
	this.closeable = false;

	//Container info
	this.index = index;
	this.container = container;

	//Atributes
	this.size = new THREE.Vector2(0, 0);
	this.position = new THREE.Vector2(0, 0);
	this.visible = false;

	//Button
	this.button = new Button(this.container.element);
	this.button.text = this.name;
	this.button.visible = true;
	this.button.position.set(container.options_size.x*index, 0);
	this.button.size.set(container.options_size.x, container.options_size.y);

	var self = this;
	this.button.callback = function()
	{
		self.container.options_selected = self.index;
		self.container.updateInterface();
	};
	this.button.updateInterface();

	//Division
	this.division = new Division(this.container.element);
	this.division.element.className = "bar";
	this.division.visible = false;
	this.division.position.set(0, this.container.options_size.y);
	this.division.updateInterface();

	//Element
	this.component = null;
}

TabOption.prototype.update = update;
TabOption.prototype.updateInterface = updateInterface;
TabOption.prototype.attachComponent = attachComponent;
TabOption.prototype.destroy = destroy;

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
	this.division.element.appendChild(this.component.element);
}

//Update Interface
function updateInterface()
{
	this.button.visible = true;
	this.division.visible = this.visible;
	this.division.size.set(this.size.x, this.size.y - this.button.size.y);

	if(this.component != null)
	{
		this.component.visible = this.visible;
		this.component.size.set(this.division.size.x, this.division.size.y);
		this.component.updateInterface();
	}

	this.button.updateInterface();
	this.division.updateInterface();
}