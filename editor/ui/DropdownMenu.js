function DropdownMenu(parent)
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
	var id = "dropmenu" + Button.id;
	var id_panel = "dropmenupanel" + Button.id;
	DropdownMenu.id++;

	//Create element
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.element.className = "button";
	this.element.style.zIndex = "100";

	//Text
	this.text = new Text(this.element);
	this.text.setText("text");
	this.text.position.set(0, 0);
	this.text.size.set(0 , 0);

	//Options Panel
	this.panel = document.createElement("div");
	this.panel.id = id_panel;
	this.panel.style.position = "absolute";
	this.panel.className = "bar";
	this.panel.style.zIndex = "200";

	//Atributes
	this.size = new THREE.Vector2(0,0);
	this.position = new THREE.Vector2(0,0);
	this.visible = true;

	//Options
	this.options_size = new THREE.Vector2(150, 20);
	this.options = [];
	this.expanded = false;

	//Click event
	var self = this;

	//Mouse over and mouse out events
	this.element.onmouseover = function()
	{
		self.expanded = true;
		self.updateInterface();
		self.element.className = "button_over";
	};

	this.element.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
		self.element.className = "button";
	};
	
	this.panel.onmouseover = function()
	{
		self.expanded = true;
		self.updateInterface();
	};

	this.panel.onmouseleave = function()
	{
		self.expanded = false;
		self.updateInterface();
	};

	//Update element
	this.updateInterface();

	//Add element to document
	this.parent.appendChild(this.element);
	this.parent.appendChild(this.panel);
}

//DropdownMenu ID counter
DropdownMenu.id = 0;

//Functions Prototype
DropdownMenu.prototype.update = update;
DropdownMenu.prototype.updateInterface = updateInterface;
DropdownMenu.prototype.addOption = addOption;
DropdownMenu.prototype.removeOption = removeOption;
DropdownMenu.prototype.destroy = destroy;
DropdownMenu.prototype.setText = setText;
DropdownMenu.prototype.updateOptions = updateOptions;

//Set Text
function setText(text)
{
	this.text.setText(text);
}

//Remove element
function destroy()
{
	try
	{
		for(var k = 0; k < this.options.length; k++)
		{
			this.options[k].destroy();
		}
		this.parent.removeChild(this.element);
	}
	catch(e){}
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

		this.updateOptions();
		this.updateInterface();
	}
}

//Add new Option to dropdown menu
function addOption(name, callback)
{
	var button = new Button(this.panel);
	button.element.style.zIndex = "10";
	button.visible = this.expanded;
	button.setText(name);
	
	var self = this;
	button.setCallback(function()
	{
		callback();
		self.expanded = false;
		self.updateInterface();
	});

	this.options.push(button);

	this.updateOptions();
	this.updateInterface();
}

//Updates options position and size
function updateOptions()
{
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].size.set(this.options_size.x, this.options_size.y);
		this.options[i].position.set(0, (this.options_size.y*i));
		this.options[i].updateInterface();
	}
}

//Update interface
function updateInterface()
{
	var visibility, visible = false;

	if(this.expanded && this.visible)
	{
		visibility = "visible";
		visible = true;
	}
	else
	{
		visibility = "hidden";
	}

	//Update Options Visibility
	for(var i = 0; i < this.options.length; i++)
	{
		this.options[i].visible = visible;
		this.options[i].element.style.visibility = visibility;
	}

	//Update text
	this.text.size.set(this.size.x, this.size.y);
	this.text.visible = this.visible;
	this.text.updateInterface();

	//Panel position, size and visibility
	this.panel.style.top = (this.position.y + this.size.y) + "px";
	this.panel.style.left = this.position.x + "px";
	this.panel.style.width = this.size.x + "px";
	this.panel.style.height = (this.options_size.y * this.options.length) + "px";
	this.panel.style.visibility = visibility;

	//Set visibility
	if(this.visible)
	{
		this.element.style.visibility = "visible";
	}
	else
	{
		this.element.style.visibility = "hidden";
	}

	//Element position and size
	this.element.style.top = this.position.y + "px";
	this.element.style.left = this.position.x + "px";
	this.element.style.width = this.size.x + "px";
	this.element.style.height = this.size.y + "px";
}