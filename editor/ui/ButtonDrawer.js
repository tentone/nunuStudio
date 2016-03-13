function ButtonDrawer(parent)
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
	var id = "but_drawer" + ButtonDrawer.id;
	var id_panel = "but_drawer_panel" + ButtonDrawer.id;
	ButtonDrawer.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";

	//Create Drawer Panel
	this.panel = document.createElement("div");
	this.panel.id = id_panel;
	this.panel.style.position = "absolute";
	this.panel.className = "bar";

	//Element atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Panel atributes
	this.panel_size = new THREE.Vector2(0, 0);
	this.panel_position = new THREE.Vector2(0, 0);

	//Image and Callback
	this.image = "";

	//Options
	this.options_per_line = 3;
	this.options = [];
	this.options_size = new THREE.Vector2(50, 50);
	this.options_spacing = new THREE.Vector2(3, 3);
	this.expanded = false;

	//Click event
	var self = this;
	this.element.onclick = function()
	{
		self.expanded = !self.expanded;
		self.updateInterface();
	};

	//Mouse over and mouse out events
	this.element.onmouseover = function()
	{
		self.element.className = "button_over";
	};

	this.element.onmouseout = function()
	{
		self.element.className = "button";
	};

	this.updatePanelSize();

	//Add element to document
	this.parent.appendChild(this.element);
	this.parent.appendChild(this.panel);
}

//ButtonDrawer ID counter
ButtonDrawer.id = 0;

//Functions Prototype
ButtonDrawer.prototype.setImage = setImage;
ButtonDrawer.prototype.update = update;
ButtonDrawer.prototype.updateInterface = updateInterface;
ButtonDrawer.prototype.destroy = destroy;
ButtonDrawer.prototype.removeOption = removeOption;
ButtonDrawer.prototype.addOption = addOption;
ButtonDrawer.prototype.updatePanelSize = updatePanelSize;

//Remove element
function destroy()
{
	for(var k = 0; k < this.options.length; k++)
	{
		this.options[k].destroy();
	}
	this.parent.removeChild(this.element);
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
		this.updatePanelSize();
		this.updateInterface();
	}
}

//Add new Option to dropdown menu
function addOption(image, callback)
{
	var button = new ButtonImage(this.panel);
	button.setImage(image);
	button.visible = this.expanded;
	button.updateInterface();
	
	var self = this;
	button.callback = function()
	{
		callback();
		button.element.className = "button";
		self.expanded = false;
		self.updateInterface();
	};

	this.options.push(button);
	this.updatePanelSize();
	this.updateInterface();
}

//Set ButtonDrawer
function setImage(image)
{
	this.image = image;
}

//Updates drawer panel size
function updatePanelSize()
{
	this.panel_size.x = (this.options_size.x * this.options_per_line);
	this.panel_size.y = (this.options_size.y * (Math.floor((this.options.length-1) / this.options_per_line)+1) );
}

//Update Interface
function updateInterface()
{
	//Update panel position y
	this.panel_position.x = this.position.x + this.size.x;
	this.panel_position.y = this.position.y;

	//Update options
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.options_size.x, this.options_size.y);
		this.options[i].position.x = this.options_size.x * (i % this.options_per_line);
		this.options[i].position.y = this.options_size.y * Math.floor(i / this.options_per_line);
		this.options[i].visible = (this.expanded && this.visible);
		this.options[i].updateInterface();
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
	this.panel.style.top = this.panel_position.y + "px";
	this.panel.style.left = this.panel_position.x + "px";
	this.panel.style.width = this.panel_size.x + "px";
	this.panel.style.height = this.panel_size.y + "px";
	
	this.element.innerHTML = '<img src="' + this.image + '" width="' + this.size.x + '" height="' + this.size.y +'">';
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}